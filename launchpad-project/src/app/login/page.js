"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => {
    setError("");
    setMode(mode === "signup" ? "signin" : "signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify({ email: user.email }));
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(
        mode === "signup"
          ? "Sign up failed. Email may already be in use."
          : "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md space-y-4 w-80">
        <h1 className="text-xl font-bold">{mode === "signup" ? "Sign Up" : "Sign In"}</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2 font-semibold">
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-400 hover:underline ml-1"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
