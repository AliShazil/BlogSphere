"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./dark-mode";
import { Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-dashed border-gray-500 bg-background">
      <div className="flex justify-between px-4 h-16 items-center">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">BlogSphere</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/blogs" className="hover:text-gray-300">
            Blogs
          </Link>
          <Link href="/create-blog" className="hover:text-gray-300">
            Create New Blog
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </SignedIn>
          <header className="flex justify-end items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button className={"cursor-pointer"}>Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button className={"cursor-pointer"}>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-gray-500">
          <Link href="/" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>
          <Link href="/create-blog" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>
            Create New Blog
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          </SignedIn>
          <Button onClick={() => setMenuOpen(false)}>Sign In</Button>
          <ModeToggle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
