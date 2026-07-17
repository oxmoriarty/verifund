"use client";

import { useState, useEffect } from "react";
import { AccountPanel } from "./AccountPanel";
import { Logo } from "./Logo";
import { useProjectCount } from "@/lib/hooks/useRPGF";
import { Activity } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const projectCount = useProjectCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo variant="mark" size="xl" />

          {/* Center Stats (Desktop only) */}
          <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full glass-card">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Network Status:</span>
              <span className="text-sm font-semibold text-primary">Live</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Projects:</span>
              <span className="text-sm font-semibold">{projectCount}</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <AccountPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
