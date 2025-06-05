"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => {
    setError("");
    setMode(mode === "signup" ? "signin" : "signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username,
          avatarURL: "", // Optional default
        });

        localStorage.setItem("user", JSON.stringify({ email: user.email }));
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify({ email: user.email }));
      }

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
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-4 w-80"
      >
        <h1 className="text-xl font-bold text-center">
          {mode === "signup" ? "Create an Account" : "Sign In"}
        </h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 rounded border border-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded border border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded border border-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 font-semibold"
        >
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-500 hover:underline ml-1"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
