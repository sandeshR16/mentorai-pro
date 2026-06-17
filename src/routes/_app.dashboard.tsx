import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, PolarRadiusAxis,
} from "recharts";
import { weeklyActivity, skillRadarData, learningPaths, recentActivities, upcomingSessions } from "@/lib/mock-data";
import { Flame, TrendingUp, Calendar, ArrowRight, Award, BookOpen, Mic, Target } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MentorAI" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <AppTopbar title="Welcome back, Sarah" subtitle="Your placement readiness updated 2 minutes ago" badge="Tier 1 Candidate" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <KpiRow />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivityChart />
            <LearningPaths />
          </div>
          <div className="space-y-6">
            <SkillRadarCard />
            <UpcomingCard />
            <RecentActivityCard />
          </div>
        </div>
      </div>
    </>
  );
}

function KpiRow() {
  const kpis = [
    { label: "Placement Readiness", value: "78%", sub: "+4% this week", icon: Target, color: "primary" },
    { label: "Learning Streak", value: "14d", sub: "Personal best!", icon: Flame, color: "amber" },
    { label: "XP Points", value: "8,420", sub: "Rank #12 in college", icon: TrendingUp, color: "secondary" },
    { label: "Mock Interviews", value: "24", sub: "+12% vs last month", icon: Mic, color: "accent" },
  ];
  const colorMap: Record<string, string> = {
    primary: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
    secondary: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20",
    accent: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="group glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`size-9 rounded-lg border grid place-items-center ${colorMap[k.color]}`}>
                <Icon className="size-4" strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-xs text-ink-500 font-medium">{k.label}</p>
            <p className="font-display text-3xl font-bold text-white mt-1 tracking-tight">{k.value}</p>
            <p className="text-xs text-ink-400 mt-2 font-mono">{k.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-white">Weekly Activity</h3>
          <p className="text-xs text-ink-500 mt-0.5">XP earned across problems and interviews</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-ink-400"><span className="size-2 rounded-full bg-brand-primary" />XP</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#64748b" style={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} stroke="#64748b" style={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} fill="url(#xpGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SkillRadarCard() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-white mb-1">Skills Radar</h3>
      <p className="text-xs text-ink-500 mb-4">You vs college benchmark</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skillRadarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <RechartsRadar dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
            <RechartsRadar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LearningPaths() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-white">Recommended Learning</h3>
          <p className="text-xs text-ink-500 mt-0.5">Curated by your AI Mentor</p>
        </div>
        <button className="text-xs text-brand-primary hover:text-brand-secondary transition-colors font-medium flex items-center gap-1">
          View all <ArrowRight className="size-3" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {learningPaths.map((p, i) => (
          <div key={p.id} className="px-6 py-4 flex items-center gap-4 group hover:bg-white/2 transition-colors">
            <div className="size-10 rounded-lg bg-white/5 border border-border grid place-items-center font-mono text-xs text-ink-400 shrink-0">
              0{i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{p.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{p.tag}</span>
                <span className="text-[10px] text-ink-400">{p.done}/{p.total} modules</span>
              </div>
            </div>
            <div className="w-32 hidden md:block">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${p.progress}%` }} />
              </div>
              <p className="text-[10px] text-ink-500 mt-1 font-mono text-right">{p.progress}%</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold bg-white text-ink-950 rounded-md px-3 py-1.5">
              Resume
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingCard() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <Calendar className="size-4 text-brand-secondary" />
          Upcoming
        </h3>
      </div>
      <div className="space-y-3">
        {upcomingSessions.map((s) => (
          <div key={s.id} className="rounded-lg border border-border bg-white/2 p-3 hover:border-brand-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-secondary">{s.type}</span>
            </div>
            <p className="text-sm font-medium text-white">{s.title}</p>
            <p className="text-xs text-ink-500 mt-0.5">{s.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivityCard() {
  const iconMap: Record<string, React.ElementType> = { interview: Mic, lesson: BookOpen, problem: Target, badge: Award };
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3.5">
        {recentActivities.map((a) => {
          const Icon = iconMap[a.type];
          return (
            <div key={a.id} className="flex items-start gap-3">
              <div className="size-7 rounded-md bg-white/5 grid place-items-center text-ink-400 shrink-0">
                <Icon className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{a.title}</p>
                <p className="text-[10px] text-ink-500 mt-0.5">{a.time}</p>
              </div>
              {a.score && <span className="text-[10px] font-mono font-bold text-brand-accent">{a.score}%</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
