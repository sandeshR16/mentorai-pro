import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { placementProbability } from "@/lib/mock-data";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/readiness")({
  head: () => ({ meta: [{ title: "Placement Readiness — MentorAI" }] }),
  component: Readiness,
});

function Readiness() {
  return (
    <>
      <AppTopbar title="Placement Readiness" subtitle="Predictive model · 94% historical accuracy" badge="Tier 1 Candidate" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadinessRing />
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white">Placement probability by company</h3>
                <p className="text-xs text-ink-500">Based on your current profile and last 3 mock interviews</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementProbability} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" style={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <EligibilityTracker />
        <Insights />
      </div>
    </>
  );
}

function ReadinessRing() {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-4">Overall Readiness</p>
      <div className="relative size-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="78%" outerRadius="100%" data={[{ value: 78, fill: "#6366f1" }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "rgba(255,255,255,0.05)" } as any} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <div className="font-display text-5xl font-bold gradient-text leading-none">78</div>
            <div className="text-xs text-ink-500 mt-1 font-mono uppercase tracking-widest">of 100</div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-300">Tier-1 ready for <span className="text-brand-accent font-semibold">5 of 6</span> target companies</p>
      <p className="text-[10px] font-mono text-brand-accent mt-1">↑ 12 pts in last 30 days</p>
    </div>
  );
}

function EligibilityTracker() {
  const rows = [
    { company: "Adobe", role: "SDE-I", status: "ready", score: 91, note: "Apply now" },
    { company: "Microsoft", role: "SDE-I", status: "ready", score: 86, note: "Apply now" },
    { company: "Amazon", role: "SDE-I", status: "ready", score: 82, note: "Strong fit" },
    { company: "Google", role: "L3 / NG", status: "almost", score: 78, note: "2 weeks more system design" },
    { company: "Stripe", role: "New Grad", status: "almost", score: 73, note: "Focus on payments domain" },
    { company: "Meta", role: "E3", status: "gap", score: 64, note: "DevOps + DSA grind needed" },
  ];
  const map = { ready: { Icon: CheckCircle2, c: "text-brand-accent" }, almost: { Icon: AlertTriangle, c: "text-amber-400" }, gap: { Icon: XCircle, c: "text-destructive" } } as const;
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-white">Company eligibility</h3>
          <p className="text-xs text-ink-500">Updated after each mock interview</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {rows.map((r) => {
          const { Icon, c } = map[r.status as keyof typeof map];
          return (
            <div key={r.company} className="px-6 py-4 grid grid-cols-12 items-center gap-4">
              <div className="col-span-3 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-white/5 border border-border grid place-items-center text-xs font-bold text-white">{r.company[0]}</div>
                <div>
                  <p className="text-sm font-medium text-white">{r.company}</p>
                  <p className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">{r.role}</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${c}`} />
                  <span className={`text-xs font-medium ${c} capitalize`}>{r.status}</span>
                </div>
              </div>
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${r.score}%` }} />
                  </div>
                  <span className="text-xs font-mono text-white w-8 text-right">{r.score}</span>
                </div>
              </div>
              <div className="col-span-3 text-right">
                <p className="text-xs text-ink-400">{r.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Insights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "Interview prediction", body: "Based on your trajectory, you'll cross the 85% readiness threshold in ~18 days at current pace.", color: "primary" },
        { title: "Biggest leverage", body: "Closing DevOps gap adds est. +9 readiness pts and unlocks 4 more companies.", color: "accent" },
        { title: "Risk signal", body: "System design score has plateaued for 6 days. Recommend deeper drill on distributed transactions.", color: "amber" },
      ].map((i) => (
        <div key={i.title} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`size-4 ${i.color === "primary" ? "text-brand-primary" : i.color === "accent" ? "text-brand-accent" : "text-amber-400"}`} />
            <h4 className="text-sm font-semibold text-white">{i.title}</h4>
          </div>
          <p className="text-xs text-ink-400 leading-relaxed">{i.body}</p>
        </div>
      ))}
    </div>
  );
}
