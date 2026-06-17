import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { leaderboard, badges } from "@/lib/mock-data";
import { Flame, Trophy, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/_app/gamification")({
  head: () => ({ meta: [{ title: "Achievements — MentorAI" }] }),
  component: Gamification,
});

function Gamification() {
  return (
    <>
      <AppTopbar title="Achievements & Leaderboard" subtitle="14-day streak · Rank #5 in IIT Bombay" badge="🔥 On Fire" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Total XP", v: "18,420", icon: Zap, c: "text-brand-primary bg-brand-primary/10 border-brand-primary/20" },
            { l: "Current Streak", v: "14 days", icon: Flame, c: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
            { l: "Badges Earned", v: "12 / 24", icon: Trophy, c: "text-brand-accent bg-brand-accent/10 border-brand-accent/20" },
            { l: "Global Rank", v: "#1,420", icon: TrendingUp, c: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.l} className="glass-card rounded-2xl p-5">
                <div className={`size-9 rounded-lg border grid place-items-center mb-3 ${k.c}`}>
                  <Icon className="size-4" strokeWidth={2.2} />
                </div>
                <p className="text-xs text-ink-500">{k.l}</p>
                <p className="font-display text-2xl font-bold text-white mt-1">{k.v}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-white">College Leaderboard</h3>
                <p className="text-xs text-ink-500">Top placement-ready engineers · IIT Bombay</p>
              </div>
              <div className="flex gap-1 glass-card rounded-md p-0.5 text-xs">
                {["Week", "Month", "All-time"].map((t, i) => (
                  <button key={t} className={`px-3 py-1 rounded ${i === 1 ? "bg-white/10 text-white" : "text-ink-400"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border">
              {leaderboard.map((p) => (
                <div key={p.rank} className={`px-6 py-3 flex items-center gap-4 ${p.isYou ? "bg-brand-primary/10" : ""}`}>
                  <div className={`size-8 rounded-md grid place-items-center font-mono font-bold text-sm ${
                    p.rank === 1 ? "bg-amber-400/20 text-amber-400" :
                    p.rank === 2 ? "bg-ink-400/20 text-ink-300" :
                    p.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                    "bg-white/5 text-ink-400"
                  }`}>{p.rank}</div>
                  <div className={`size-9 rounded-full bg-gradient-to-br ${
                    p.rank === 1 ? "from-amber-400 to-orange-500" :
                    p.rank === 2 ? "from-indigo-400 to-violet-500" :
                    p.rank === 3 ? "from-emerald-400 to-teal-500" :
                    p.isYou ? "from-cyan-400 to-blue-500" :
                    "from-slate-400 to-slate-600"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${p.isYou ? "text-white" : "text-ink-200"}`}>
                      {p.name} {p.isYou && <span className="text-[10px] font-mono text-brand-primary ml-2">YOU</span>}
                    </p>
                    <p className="text-xs text-ink-500">{p.college}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-xs text-amber-400">
                    <Flame className="size-3" /> {p.streak}d
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-white text-sm">{p.xp.toLocaleString()}</p>
                    <p className="text-[10px] font-mono text-ink-500 uppercase">xp</p>
                  </div>
                  <div className="w-8 text-right">
                    {p.change > 0 ? <TrendingUp className="size-3.5 text-brand-accent inline" /> :
                     p.change < 0 ? <TrendingDown className="size-3.5 text-destructive inline" /> :
                     <Minus className="size-3.5 text-ink-500 inline" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-1">Streak calendar</h3>
            <p className="text-xs text-ink-500 mb-5">Last 91 days</p>
            <div className="grid grid-cols-13 gap-1" style={{ gridTemplateColumns: "repeat(13, 1fr)" }}>
              {Array.from({ length: 91 }).map((_, i) => {
                const intensity = Math.random();
                const cls = intensity > 0.8 ? "bg-brand-accent" : intensity > 0.5 ? "bg-brand-accent/60" : intensity > 0.25 ? "bg-brand-accent/30" : "bg-white/5";
                return <div key={i} className={`aspect-square rounded-sm ${cls}`} />;
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-ink-500">
              <span>Less</span>
              <div className="flex gap-1">
                {["bg-white/5", "bg-brand-accent/30", "bg-brand-accent/60", "bg-brand-accent"].map((c) => (
                  <div key={c} className={`size-2.5 rounded-sm ${c}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-white mb-1">Badges</h3>
          <p className="text-sm text-ink-500 mb-5">Unlock achievements as you progress</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((b) => (
              <div key={b.id} className={`glass-card rounded-2xl p-5 text-center transition-all hover:-translate-y-1 ${!b.earned ? "opacity-40 grayscale" : ""}`}>
                <div className={`size-16 mx-auto mb-3 rounded-2xl grid place-items-center text-3xl ${
                  b.rarity === "legendary" ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30" :
                  b.rarity === "epic" ? "bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30" :
                  b.rarity === "rare" ? "bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30" :
                  "bg-white/5 border border-border"
                }`}>{b.icon}</div>
                <p className="font-medium text-white text-sm">{b.name}</p>
                <p className="text-[10px] text-ink-500 mt-1 leading-tight">{b.desc}</p>
                <p className={`text-[9px] font-mono uppercase tracking-widest mt-2 ${
                  b.rarity === "legendary" ? "text-amber-400" :
                  b.rarity === "epic" ? "text-violet-400" :
                  b.rarity === "rare" ? "text-brand-primary" : "text-ink-500"
                }`}>{b.rarity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
