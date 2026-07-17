"use client";

import { useProjects } from "@/lib/hooks/useRPGF";
import { ProjectForm } from "@/components/ProjectForm";
import { ProjectCard } from "@/components/ProjectCard";
import { Navbar } from "@/components/Navbar";
import { Loader2, Zap } from "lucide-react";

export default function Home() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative selection:bg-white/20 selection:text-white">
      <Navbar />

      <main className="pt-32 pb-16 px-6 md:px-8 max-w-6xl mx-auto grid gap-12">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Retroactive Funding
          </h1>
          <p className="text-white/60 font-medium max-w-xl leading-relaxed">
            Evaluate and fund impactful public goods on the GenLayer protocol.
          </p>
        </header>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-32">
            <ProjectForm />
          </aside>

          <section className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
              <span className="text-xs font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {projects?.length || 0}
              </span>
            </div>

            {isLoading ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl h-64 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white/40" />
              </div>
            ) : error ? (
              <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 shadow-2xl shadow-black/50 rounded-2xl p-6 text-red-400 text-sm font-medium">
                Failed to load projects: {error.message}
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl h-64 flex flex-col gap-3 items-center justify-center text-white/40">
                <Zap className="w-6 h-6 opacity-50" />
                <p className="text-sm font-medium">No projects found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project, idx) => (
                  <ProjectCard key={`${project.url}-${idx}`} project={project} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
