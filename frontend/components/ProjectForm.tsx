"use client";

import { useState } from "react";
import { useSubmitProject } from "@/lib/hooks/useRPGF";
import { Link, AlignLeft, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ProjectForm() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { submitProject, isSubmitting, txStatus, error } = useSubmitProject();

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return string.startsWith("http://") || string.startsWith("https://");
    } catch (_) {
      return false;
    }
  };

  const isFormValid = url.trim() !== "" && description.trim() !== "" && isValidUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    submitProject({ projectUrl: url, description });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-6 rounded-2xl relative">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Submit</h2>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-white/60 flex items-center gap-2">
            <Link className="w-3.5 h-3.5" />
            URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/..."
            className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-white/20 focus:outline-none transition-all placeholder:text-white/20"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-white/60 flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </label>
          </div>
          <textarea
            placeholder="Impact details..."
            className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none focus:ring-1 focus:ring-white/20 focus:outline-none transition-all placeholder:text-white/20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={500}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full h-10 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out active:scale-95 ${
            !isFormValid 
              ? "bg-white/5 text-white/40 cursor-not-allowed" 
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Evaluate
            </>
          )}
        </button>
      </form>

      {isSubmitting && (
        <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-20 flex items-center justify-center rounded-2xl border border-white/5">
          <div className="text-center space-y-3">
            {txStatus === "PENDING" && <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/60" />}
            {txStatus === "ACCEPTED" && <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/60" />}
            {txStatus === "FINALIZED" && <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />}
            <p className="text-sm font-medium text-white/80">
              {txStatus === "PENDING" && "Sending to network..."}
              {txStatus === "ACCEPTED" && "Awaiting consensus..."}
              {txStatus === "FINALIZED" && "Finalized."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
