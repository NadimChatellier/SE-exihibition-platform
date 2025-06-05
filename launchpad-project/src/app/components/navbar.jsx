"use client";

import React from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react"; // simple user icon
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getAuth } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const museums = [
  {
    name: "Victoria and Albert Museum",
    href: "/browse?museum=VandA",
    description: "Explore the vast collection of decorative arts.",
  },
  {
    name: "Harvard University",
    href: "/browse?museum=Harvard",
    description: "Dive into Harvard's art and historical artifacts.",
  },
];



// (keep all your current imports here)

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <nav className="w-full bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-300"
          >
            ArtGallery
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {/* Dropdown Menu */}
           

            {/* Sign In / Profile Icon */}
            {user ? (<>
              <Link
  href={`/user/${user.uid}`} // <- dynamic route based on user ID
  className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
>
  <img
    src={user.photoURL || "/images/765-default-avatar.png"}
    alt="User Avatar"
    className="w-6 h-6 rounded-full object-cover"
  />
</Link>

              <button
  onClick={() => signOut(auth)}
  className="text-sm text-red-400 hover:text-red-300"
>
  Logout
</button>
            </>
              

            ) : (
              <Link href="/login" className="text-gray-300 hover:text-blue-400 text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
