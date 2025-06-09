"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-300"
            >
              ArtGallery
            </Link>
          </div>

          {/* Right side: navigation & hamburger */}
          <div className="flex items-center gap-6">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  {/* Add user avatar and logout here */}
                  <Link
                    href={`/user/${user.uid}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
                  >
                    <img
                      src={user.photoURL || "/images/765-default-avatar.png"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user.displayName || "Profile"}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-blue-400 text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center text-gray-300 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-6 py-4 border-t border-gray-700">
          {user ? (
            <>
              <Link
                href={`/user/${user.uid}`}
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 mb-4"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src={user.photoURL || "/images/765-default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{user.displayName || "Profile"}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-gray-300 hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
