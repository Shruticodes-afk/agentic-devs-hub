"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/events", label: "Events" },
  { href: "/assistant", label: "Assistant" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-white text-lg font-bold transition-opacity group-hover:opacity-80">
              agentic-devs
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80 font-medium">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <div className="w-7 h-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white text-xs font-bold">
                  {(
                    user.user_metadata?.full_name?.[0] ||
                    user.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/login" />}
                  className="text-white/80 hover:text-white text-sm"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  render={<Link href="/signup" />}
                  className="bg-white text-black font-semibold hover:bg-gray-200 text-sm rounded-full px-5"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/[0.06] mt-2">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-md text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-white font-semibold bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-2">
                {user ? (
                  <div className="px-3 py-2 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white text-xs font-bold">
                      {(
                        user.user_metadata?.full_name?.[0] ||
                        user.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>
                    <span className="text-sm text-white/80 font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" render={<Link href="/login" />} className="justify-start text-white/80 hover:text-white">
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      render={<Link href="/signup" />}
                      className="bg-white text-black font-semibold hover:bg-gray-200 rounded-full"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
