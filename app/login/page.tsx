'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both fields.");
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.ok) {
      setError("Invalid credentials.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-center">Login</h1>
  
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
  
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2 mb-2"
          onChange={(e) => setEmail(e.target.value)}
          suppressHydrationWarning
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2 mb-4"
          onChange={(e) => setPassword(e.target.value)}
          suppressHydrationWarning
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded transition-colors"
          suppressHydrationWarning
        >
          Login
        </button>
  
        <p className="mt-4 text-center text-sm">
          Don%apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}