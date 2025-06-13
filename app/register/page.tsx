"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      console.log(data)
      router.push("/login")
    } catch (error: any) {
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign up to get started with our platform</p>
        </div>

        {error && <div className="p-3 bg-red-950 border border-red-900 text-red-200 rounded-md text-sm">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSumit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-zinc-300 hover:text-white transition-colors">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
