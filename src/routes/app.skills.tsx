import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { skillRadarData } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Sparkles, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/app/skills")({
  head: () => ({ meta: [{ title: "Skill Gap Analysis — MentorAI" }] }),
  component: Skills,
});

function Skills() {
  const strengths = skillRadarData.filter((s) => s.value >= s.benchmark).sort((a, b) => b.value - a.value);
  const gaps = skillRadarData.filter((s) => s.value < s.benchmark).sort((a, b) => (a.value - a.benchmark) - (b.value - b.benchmark));
  return (
    <>
      <AppTopbar title="Skill Gap Analysis" subtitle="Benchmarked against last year's placed batch from your college" badge="Updated 2h ago" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white">Skill matrix</h3>
                <p className="text-xs text-ink-500">Indigo = you · Slate = college benchmark</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <RechartsRadar dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.15} />
                  <RechartsRadar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} strokeWidth={2.5} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Industry Benchmark</p>
              <p className="font-display text-4xl font-bold text-white mt-2">79<span className="text-ink-500 text-2xl">/100</span></p>
              <p className="text-xs text-brand-accent font-mono mt-1">↑ 12 pts above peer median</p>
            </div>
            <div className="glass-card rounded-2xl p-6 border-brand-primary/20 bg-brand-primary/5">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-brand-primary/20 grid place-items-center shrink-0">
                  <Sparkles className="size-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Recommendation</p>
                  <p className="text-xs text-ink-400 mt-1 leading-relaxed">Spend the next 2 weeks on DevOps fundamentals — closing this gap unlocks Stripe & Atlassian eligibility.</p>
                  <button className="mt-3 text-xs text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1">
                    Start path <ArrowUpRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillList title="Strengths" items={strengths} positive />
          <SkillList title="Gaps to close" items={gaps} />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white">Progress comparison · last 6 weeks</h3>
              <p className="text-xs text-ink-500">Tracking improvement vs your own baseline</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillRadarData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="skill" stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="benchmark" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

function SkillList({ title, items, positive }: { title: string; items: typeof skillRadarData; positive?: boolean }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "text-brand-accent" : "text-amber-400";
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <Icon className={`size-4 ${color}`} /> {title}
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{items.length} areas</span>
      </div>
      <div className="space-y-3">
        {items.map((s) => {
          const diff = s.value - s.benchmark;
          return (
            <div key={s.skill} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-white/2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{s.skill}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${positive ? "bg-brand-accent" : "bg-amber-400"}`} style={{ width: `${s.value}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-ink-500">{s.value}</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${diff >= 0 ? "text-brand-accent" : "text-amber-400"}`}>
                {diff >= 0 ? "+" : ""}{diff}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
