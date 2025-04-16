"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { ModeToggle } from "./dark-mode"
import { Menu, X, Pencil, LayoutDashboard, BookOpen } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const NavLink = ({ href, children, icon: Icon }) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-1.5 transition-colors duration-200 hover:text-primary",
          isActive ? "text-primary font-medium" : "text-muted-foreground",
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span className="relative">
          {children}
          <span
            className={cn(
              "absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-200",
              isActive ? "w-full" : "group-hover:w-full",
            )}
          ></span>
        </span>
      </Link>
    )
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
            B
          </span>
          <h1 className="text-xl font-bold tracking-tight">
            Blog<span className="text-primary">Sphere</span>
          </h1>
        </Link>

        {/* Desktop Layout - Everything on Right Side */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <NavLink href="/blogs" icon={BookOpen}>
              Blogs
            </NavLink>
            <NavLink href="/create-blog" icon={Pencil}>
              Create
            </NavLink>
            <SignedIn>
              <NavLink href="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
            </SignedIn>
          </div>

          {/* Auth & Theme Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-full">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <ModeToggle />
          <button
            className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 transform transition-all duration-300 ease-in-out md:hidden",
          menuOpen
            ? "translate-y-0 opacity-100 bg-background/95 backdrop-blur-sm border-b"
            : "translate-y-[-100%] opacity-0 pointer-events-none",
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Link
              href="/blogs"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Blogs</span>
            </Link>
            <Link
              href="/create-blog"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              <Pencil className="h-5 w-5 text-primary" />
              <span>Create New Blog</span>
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span>Dashboard</span>
              </Link>
            </SignedIn>
          </div>

          <div className="mt-2 pt-4 border-t">
            <SignedOut>
              <div className="flex flex-col gap-3">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full justify-start">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-start">Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
