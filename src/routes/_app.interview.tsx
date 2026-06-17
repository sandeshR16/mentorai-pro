import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useState } from "react";
import { Mic, MicOff, Play, Clock, Building2, Briefcase, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { interviewQuestions } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — MentorAI" }] }),
  component: Interview,
});

function Interview() {
  const [stage, setStage] = useState<"setup" | "live" | "report">("setup");
  return (
    <>
      <AppTopbar title="Mock Interview Simulator" subtitle="Replicates real Tier-1 company interview formats" badge="AI Examiner" />
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {stage === "setup" && <SetupScreen onStart={() => setStage("live")} />}
        {stage === "live" && <LiveScreen onFinish={() => setStage("report")} />}
        {stage === "report" && <ReportScreen onRestart={() => setStage("setup")} />}
      </div>
    </>
  );
}

function SetupScreen({ onStart }: { onStart: () => void }) {
  const [mode, setMode] = useState<"hr" | "technical" | "company">("technical");
  const modes = [
    { id: "hr", title: "HR Interview", desc: "Behavioral, motivation, culture-fit", icon: Users, color: "secondary", time: "20 min" },
    { id: "technical", title: "Technical Round", desc: "DSA, system design, code-along", icon: Briefcase, color: "primary", time: "45 min" },
    { id: "company", title: "Company-Specific", desc: "Google, Meta, Stripe pattern match", icon: Building2, color: "accent", time: "60 min" },
  ] as const;
  const colorMap: Record<string, string> = {
    primary: "border-brand-primary/40 bg-brand-primary/5",
    secondary: "border-brand-secondary/40 bg-brand-secondary/5",
    accent: "border-brand-accent/40 bg-brand-accent/5",
  };
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">Configure your session</h3>
        <p className="text-ink-400">Pick a mode. Our AI examiner adjusts difficulty in real-time based on your responses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => setMode(m.id)} className={`text-left glass-card rounded-2xl p-6 transition-all ${active ? colorMap[m.color] + " ring-2 ring-brand-primary/30" : "hover:border-white/15"}`}>
              <div className="flex items-start justify-between mb-4">
                <Icon className={`size-6 ${active ? "text-brand-primary" : "text-ink-400"}`} />
                {active && <CheckCircle2 className="size-5 text-brand-accent" />}
              </div>
              <h4 className="font-display font-semibold text-white mb-1">{m.title}</h4>
              <p className="text-sm text-ink-400 mb-4">{m.desc}</p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 flex items-center gap-1.5">
                <Clock className="size-3" /> {m.time}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-white mb-4">Target company</h4>
          <div className="grid grid-cols-3 gap-2">
            {["Google", "Meta", "Microsoft", "Amazon", "Stripe", "Atlassian", "Adobe", "Uber", "Other"].map((c, i) => (
              <button key={c} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${i === 0 ? "bg-brand-primary/10 border-brand-primary/30 text-white" : "border-border text-ink-400 hover:text-white hover:border-white/15"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-white mb-4">Role level</h4>
          <div className="space-y-2">
            {[
              { l: "L3 / SDE-I / New Grad", on: false },
              { l: "L4 / SDE-II", on: true },
              { l: "L5 / Senior", on: false },
            ].map((r) => (
              <label key={r.l} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${r.on ? "bg-brand-primary/10 border-brand-primary/30" : "border-border hover:border-white/15"}`}>
                <span className={`size-4 rounded-full border-2 grid place-items-center ${r.on ? "border-brand-primary" : "border-ink-600"}`}>
                  {r.on && <span className="size-2 rounded-full bg-brand-primary" />}
                </span>
                <span className="text-sm text-white">{r.l}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onStart} className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 justify-center">
        <Play className="size-4 fill-current" /> Start mock interview
      </button>
    </div>
  );
}

function LiveScreen({ onFinish }: { onFinish: () => void }) {
  const [muted, setMuted] = useState(false);
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between glass-card rounded-2xl px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary grid place-items-center text-white font-bold text-sm">AI</div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-brand-accent border-2 border-background animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Examiner Mei · Google L4 Technical</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-accent">Recording in progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 font-mono text-sm">
            <Clock className="size-3.5 text-ink-400" />
            <span className="text-white tabular-nums">27:42</span>
            <span className="text-ink-500">/ 45:00</span>
          </div>
          <button onClick={onFinish} className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors">
            End session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary">Question 3 of 5</span>
              <span className="text-[10px] text-ink-500 font-mono">Difficulty: HARD</span>
            </div>
            <h3 className="font-display text-xl text-white leading-snug mb-4">
              {interviewQuestions.technical[0]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Scalability", "Distributed Systems", "Caching", "Database Design"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-ink-400 uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-ink-400">Your answer (transcribed live)</p>
              <button onClick={() => setMuted((m) => !m)} className={`size-9 rounded-lg grid place-items-center transition-all ${muted ? "bg-destructive/20 text-destructive" : "bg-brand-accent/20 text-brand-accent animate-pulse-ring"}`}>
                {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
            </div>
            <div className="min-h-[180px] rounded-xl bg-ink-950 border border-border p-4 font-mono text-sm text-ink-300 leading-relaxed">
              <span className="text-brand-secondary">{">"}</span> So I'd start by clarifying scale — assuming roughly 100M URLs created per day, we need around 1,200 writes per second with peaks of 10x...
              <span className="ml-1 inline-block w-1.5 h-4 bg-brand-primary align-middle animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Live Signals</p>
            <div className="space-y-3">
              {[
                { l: "Clarity", v: 84, c: "bg-brand-accent" },
                { l: "Structure", v: 76, c: "bg-brand-primary" },
                { l: "Technical Depth", v: 68, c: "bg-brand-secondary" },
                { l: "Confidence", v: 72, c: "bg-amber-400" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-400">{s.l}</span>
                    <span className="font-mono text-white">{s.v}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.c} transition-all`} style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Hints used</p>
            <div className="flex gap-2">
              {[true, false, false].map((u, i) => (
                <div key={i} className={`flex-1 h-8 rounded-md border ${u ? "bg-amber-400/10 border-amber-400/30" : "border-border"}`} />
              ))}
            </div>
            <button className="mt-3 w-full text-xs text-brand-primary hover:text-brand-secondary font-medium">Request hint (–10 XP)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-2">// Session Report</p>
            <h3 className="font-display text-3xl font-bold text-white">Strong performance.</h3>
            <p className="text-ink-400 mt-1">Google L4 Technical · 41 min · 5 questions</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display text-6xl font-bold gradient-text leading-none">82</span>
            <span className="text-ink-400 mb-2">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-white mb-4">AI Feedback</h4>
          <div className="space-y-4">
            {[
              { type: "win", title: "Excellent capacity estimation", text: "You correctly calculated QPS and storage projections within the first 3 minutes — top 10% of candidates at this level." },
              { type: "gap", title: "Missed: data consistency tradeoffs", text: "When discussing the read path, you didn't address eventual vs strong consistency. Drill: 'consistency-tradeoffs-101'." },
              { type: "win", title: "Clean communication", text: "Walked through assumptions before diving into design. Examiners love this." },
            ].map((f, i) => (
              <div key={i} className="border-l-2 pl-4 py-1" style={{ borderColor: f.type === "win" ? "#10b981" : "#f59e0b" }}>
                <p className="text-sm font-medium text-white">{f.title}</p>
                <p className="text-xs text-ink-400 mt-1 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Scores</p>
            {[
              { l: "Technical Depth", v: 78 },
              { l: "Communication", v: 91 },
              { l: "Problem Solving", v: 84 },
              { l: "Confidence", v: 76 },
            ].map((s) => (
              <div key={s.l} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-400">{s.l}</span>
                  <span className="font-mono text-white">{s.v}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={onRestart} className="w-full px-5 py-3 bg-brand-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-primary-soft transition-colors">
            New mock <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
