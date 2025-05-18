"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

export default function Navbar() {
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

          {/* Navigation Menu */}
          <NavigationMenu>
          <NavigationMenuList >

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="
                    bg-gray-800 text-gray-300 
                    hover:bg-gray-700 hover:text-blue-400
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
                    dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400
                    transition-colors duration-200 rounded-md px-3 py-1
                  "
                >
                  Museums
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gray-800 rounded-md shadow-lg border border-gray-700 p-4">
                  <ul className="grid gap-3 md:w-[300px]">
                    {museums.map(({ name, href, description }) => (
                      <ListItem key={name} href={href} title={name}>
                        {description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
          className
        )}
        {...props}
      >
        <div className="text-sm font-semibold leading-none text-gray-200">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-gray-300">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
