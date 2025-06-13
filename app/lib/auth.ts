import { NextAuthOptions } from "next-auth";
import User from "../models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./connectdb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }
                try {
                    await connectDB();

                    const user = await User.findOne({email: credentials.email});
                    if (!user) {
                        throw new Error("No user found with the provided email");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    
                    // or Return user object
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                }catch (error) {
                    console.error("Error during authorization:", error);
                    throw new Error("Authorization failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id.toString();
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login", // Error code passed in query string as ?error=
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};