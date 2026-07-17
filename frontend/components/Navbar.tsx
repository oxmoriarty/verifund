"use client";

import { AccountPanel } from "./AccountPanel";
import { Logo } from "./Logo";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Logo variant="mark" size="md" />
            <div className="hidden md:flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-medium text-white/60">Live</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <AccountPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
