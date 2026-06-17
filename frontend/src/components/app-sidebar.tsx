import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Mic,
  Radar,
  Target,
  Map,
  Trophy,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/mentor", label: "AI Mentor", icon: Sparkles },
  { to: "/app/interview", label: "Mock Interview", icon: Mic },
  { to: "/app/skills", label: "Skill Gap", icon: Radar },
  { to: "/app/readiness", label: "Placement Readiness", icon: Target },
  { to: "/app/roadmap", label: "Career Roadmap", icon: Map },
  { to: "/app/gamification", label: "Achievements", icon: Trophy },
  { to: "/app/admin", label: "Admin", icon: Shield },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/sign-in";
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-sidebar/60 backdrop-blur-xl flex-col">
      <Link to="/" className="p-6 flex items-center gap-3 group">
        <div className="size-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
          <div className="size-4 bg-white/30 rounded-sm rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-tight text-white leading-none">MentorAI</span>
          <span className="text-[10px] font-mono text-ink-500 uppercase tracking-widest mt-0.5">v2.4 · pro</span>
        </div>
      </Link>

      <nav className="flex-1 px-3 space-y-0.5 mt-2">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-ink-500">Workspace</p>
        {navItems.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group " +
                (active
                  ? "bg-brand-primary/10 text-white border border-brand-primary/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                  : "text-ink-400 hover:text-white hover:bg-white/5 border border-transparent")
              }
            >
              <Icon className={"size-4 " + (active ? "text-brand-primary" : "text-ink-500 group-hover:text-ink-300")} strokeWidth={2} />
              <span>{item.label}</span>
              {active && <span className="ml-auto size-1.5 rounded-full bg-brand-primary animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-3">
        <div className="rounded-xl glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Readiness</p>
            <span className="text-[10px] font-mono text-brand-accent">+4 wk</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[78%] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent" />
          </div>
          <p className="mt-2 text-sm font-display font-bold text-white">78% <span className="text-xs font-normal text-ink-500">Tier-1 Ready</span></p>
        </div>
        <div className="flex items-center gap-2 px-2">
          <button className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ink-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            <Settings className="size-3.5" />
            Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ink-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
