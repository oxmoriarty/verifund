"use client";

import { useState } from "react";
import { useSubmitProject } from "@/lib/hooks/useRPGF";
import { Link, AlignLeft, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

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
    <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Submit Project</h2>
          <p className="text-sm text-muted-foreground">
            Enter the details of the public good project for AI evaluation and retroactive funding consideration.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
              <Link className="w-4 h-4 text-primary" />
              Project URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/your/project"
              className="w-full bg-input/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none input-glow placeholder:text-muted-foreground/50 transition-colors"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {url && !isValidUrl(url) && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> Please enter a valid URL with http:// or https://
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-primary" />
                Impact Description
              </label>
              <span className={`text-xs ${description.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {description.length} / 500
              </span>
            </div>
            <textarea
              placeholder="Describe the project's impact and why it deserves retroactive funding..."
              className="w-full bg-input/50 border border-border rounded-lg px-4 py-3 text-sm min-h-[120px] resize-y focus:outline-none input-glow placeholder:text-muted-foreground/50 transition-colors"
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
            className={`w-full btn-primary h-12 flex items-center justify-center gap-2 text-base mt-2 ${
              !isFormValid ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground shadow-none hover:transform-none" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {txStatus === "PENDING" && "Sending to GenLayer..."}
                {txStatus === "ACCEPTED" && "Awaiting Consensus..."}
                {txStatus === "FINALIZED" && "Finalizing..."}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Evaluate Project
              </>
            )}
          </button>
        </form>

        {/* Status Tracker Overlay when submitting */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl border border-border/50">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 space-y-6">
              <h3 className="text-center font-bold text-lg">Transaction Status</h3>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-3 rounded-lg border ${txStatus === "PENDING" ? "border-primary bg-primary/10" : "border-border/50"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txStatus !== "IDLE" ? "bg-primary text-background" : "bg-muted text-muted-foreground"}`}>
                    {txStatus === "PENDING" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Pending</p>
                    <p className="text-xs text-muted-foreground">Broadcast to GenLayer</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-lg border ${txStatus === "ACCEPTED" ? "border-primary bg-primary/10" : "border-border/50"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txStatus === "ACCEPTED" || txStatus === "FINALIZED" ? "bg-primary text-background" : "bg-muted text-muted-foreground"}`}>
                    {txStatus === "ACCEPTED" ? <Loader2 className="w-4 h-4 animate-spin" /> : (txStatus === "FINALIZED" ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">2</span>)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Accepted</p>
                    <p className="text-xs text-muted-foreground">AI Evaluating Impact</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-lg border ${txStatus === "FINALIZED" ? "border-primary bg-primary/10" : "border-border/50"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txStatus === "FINALIZED" ? "bg-primary text-background" : "bg-muted text-muted-foreground"}`}>
                    {txStatus === "FINALIZED" ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">3</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Finalized</p>
                    <p className="text-xs text-muted-foreground">Stored on-chain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
