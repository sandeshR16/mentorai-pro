import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { roadmap } from "@/lib/mock-data";
import { CheckCircle2, Circle, Loader2, Award, Target } from "lucide-react";

export const Route = createFileRoute("/_app/roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap — MentorAI" }] }),
  component: Roadmap,
});

function Roadmap() {
  return (
    <>
      <AppTopbar title="Career Roadmap" subtitle="Your path to Google L4 · est. completion Nov 2024" badge="Active Goal" />
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { l: "Goal", v: "Google · SWE L4", c: "primary" },
            { l: "Timeline", v: "10 months", c: "secondary" },
            { l: "Progress", v: "38% · on track", c: "accent" },
          ].map((s) => (
            <div key={s.l} className="glass-card rounded-2xl p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{s.l}</p>
              <p className="font-display text-2xl font-bold text-white mt-1">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Phases</h3>
              <p className="text-xs text-ink-500 mt-1">Drag phases to reorder · click milestones to track</p>
            </div>
            <button className="px-4 py-2 rounded-lg glass-card text-sm font-medium text-ink-200 hover:text-white transition-colors">
              Adjust goal
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-primary via-brand-secondary to-transparent" />
            <div className="space-y-10">
              {roadmap.map((phase, i) => {
                const Icon = phase.status === "completed" ? CheckCircle2 : phase.status === "active" ? Loader2 : Circle;
                const color = phase.status === "completed" ? "text-brand-accent bg-brand-accent" : phase.status === "active" ? "text-brand-secondary bg-brand-secondary animate-pulse" : "text-ink-500 bg-ink-700";
                return (
                  <div key={i} className="relative flex gap-6">
                    <div className={`size-8 rounded-full border-4 border-background ${color.split(" ")[1]} ${color.includes("animate") ? "animate-pulse" : ""} grid place-items-center shrink-0 z-10`}>
                      <Icon className={`size-4 text-white ${phase.status === "active" ? "animate-spin" : ""}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h4 className={`font-display font-semibold ${phase.status === "upcoming" ? "text-ink-500" : "text-white"}`}>{phase.phase}</h4>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
                          phase.status === "completed" ? "bg-brand-accent/10 text-brand-accent" :
                          phase.status === "active" ? "bg-brand-secondary/10 text-brand-secondary" :
                          "bg-white/5 text-ink-500"
                        }`}>{phase.status}</span>
                        <span className="text-xs text-ink-500 font-mono">{phase.timeline}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {phase.milestones.map((m, mi) => (
                          <span key={mi} className={`text-xs px-3 py-1.5 rounded-lg border ${
                            phase.status === "completed" ? "border-brand-accent/20 bg-brand-accent/5 text-ink-300" :
                            phase.status === "active" ? "border-brand-secondary/20 bg-brand-secondary/5 text-white" :
                            "border-border text-ink-500"
                          }`}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="size-4 text-brand-accent" /> Certifications to acquire
            </h4>
            <div className="space-y-3">
              {[
                { n: "AWS Cloud Practitioner", s: "Pending · 3 weeks" },
                { n: "Google Cloud ACE", s: "Recommended" },
                { n: "MongoDB Developer", s: "Optional" },
              ].map((c) => (
                <div key={c.n} className="flex items-center justify-between p-3 rounded-lg border border-border bg-white/2">
                  <p className="text-sm text-white">{c.n}</p>
                  <span className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">{c.s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="size-4 text-brand-primary" /> Goal tracking
            </h4>
            {[
              { l: "Reach 85% readiness", v: 78, t: 85 },
              { l: "Complete 30 mocks", v: 24, t: 30 },
              { l: "Solve 500 DSA problems", v: 312, t: 500 },
            ].map((g) => (
              <div key={g.l} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">{g.l}</span>
                  <span className="font-mono text-white">{g.v}/{g.t}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${(g.v / g.t) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
