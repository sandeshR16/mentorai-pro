import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Flame, Trophy, Zap, TrendingUp, Sparkles, Loader2, Minus, Award } from "lucide-react";

export const Route = createFileRoute("/app/gamification")({
  head: () => ({ meta: [{ title: "Achievements — MentorAI" }] }),
  component: Gamification,
});

interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

interface LeaderboardEntry {
  _id: string;
  xp: number;
  streak: number;
  userId?: {
    _id: string;
    name: string;
    branch: string;
  };
}

function Gamification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GamificationStats>({ xp: 10, level: 1, streak: 1, badges: ["Beginner"] });
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchStatsAndLeaderboard();
  }, []);

  const fetchStatsAndLeaderboard = async () => {
    try {
      const statsRes = await api.get("/gamification/stats");
      setStats(statsRes.data);

      const leaderboardRes = await api.get("/gamification/leaderboard");
      setLeaderboardList(leaderboardRes.data || []);
    } catch (err) {
      console.error(err);
      localStorage.clear();
      navigate({ to: "/auth/sign-in" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-3 bg-background">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <span className="text-sm text-ink-400 font-medium">Loading Achievements...</span>
      </div>
    );
  }

  // Unified company badges representation mapping backend string values
  const badgeDefinitions = [
    { name: "Beginner", desc: "First 100 XP achieved", icon: "⭐", rarity: "common", earned: stats.badges.includes("Beginner") },
    { name: "Quiz Whiz", desc: "Accumulated 300+ XP in study", icon: "⚡", rarity: "rare", earned: stats.badges.includes("Quiz Whiz") },
    { name: "Interview Master", desc: "Completed multiple mock reviews (500+ XP)", icon: "👑", rarity: "legendary", earned: stats.badges.includes("Interview Master") },
    { name: "First Streak", desc: "Kept a daily activity streak going", icon: "🔥", rarity: "epic", earned: stats.streak >= 2 },
  ];

  return (
    <>
      <AppTopbar title="Achievements & Leaderboard" subtitle={`${stats.streak}-day streak &bull; Level ${stats.level} Student`} badge="🔥 On Fire" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-up">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Total XP Points", v: stats.xp.toLocaleString(), icon: Zap, c: "text-brand-primary bg-brand-primary/10 border-brand-primary/20" },
            { l: "Current Streak", v: `${stats.streak} days`, icon: Flame, c: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
            { l: "Unlocked Badges", v: `${stats.badges.length} Unlocked`, icon: Trophy, c: "text-brand-accent bg-brand-accent/10 border-brand-accent/20" },
            { l: "Gamification Status", v: `Level ${stats.level}`, icon: Award, c: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20" },
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
          {/* Leaderboard */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-white">Global Placement Leaderboard</h3>
                <p className="text-xs text-ink-500">Top placement-ready candidates across specialties</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {leaderboardList.map((p, index) => {
                const rank = index + 1;
                return (
                  <div key={p._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className={`size-8 rounded-md grid place-items-center font-mono font-bold text-sm ${
                      rank === 1 ? "bg-amber-400/20 text-amber-400" :
                      rank === 2 ? "bg-ink-400/20 text-ink-300" :
                      rank === 3 ? "bg-orange-500/20 text-orange-400" :
                      "bg-white/5 text-ink-400"
                    }`}>{rank}</div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-200">
                        {p.userId?.name || "Student"}
                      </p>
                      <p className="text-xs text-ink-500">{p.userId?.branch || "Computer Science Specialty"}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-1 text-xs text-amber-400 mr-4">
                      <Flame className="size-3" /> active login
                    </div>

                    <div className="text-right">
                      <p className="font-display font-bold text-white text-sm">{p.xp.toLocaleString()}</p>
                      <p className="text-[10px] font-mono text-ink-500 uppercase">xp</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Progress */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-semibold text-white mb-1">XP Level Up</h3>
              <p className="text-xs text-ink-500 mb-5">Current milestone completion</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>LEVEL {stats.level}</span>
                    <span>{stats.xp % 100} / 100 XP</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div style={{ width: `${stats.xp % 100}%` }} className="h-full bg-brand-primary rounded-full" />
                  </div>
                </div>

                <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 flex gap-3 items-start">
                  <Sparkles className="size-4 text-brand-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-ink-300 leading-relaxed">
                    Unlocking **Quiz Whiz** requires 300 XP. Solve mock interviews and update skills parameters to gain more XP points!
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] font-mono text-ink-600 text-center mt-6">Updated in real-time across active portals</p>
          </div>
        </div>

        {/* Badges Display */}
        <div>
          <h3 className="font-display text-xl font-bold text-white mb-1">Earned Badges</h3>
          <p className="text-sm text-ink-500 mb-5">Unlock achievements as you consult AI mentors and complete reviews</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badgeDefinitions.map((b) => (
              <div key={b.name} className={`glass-card rounded-2xl p-5 text-center transition-all hover:-translate-y-1 ${!b.earned ? "opacity-35 grayscale" : ""}`}>
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
