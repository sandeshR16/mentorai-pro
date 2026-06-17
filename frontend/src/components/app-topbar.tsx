import { Search, Bell, Command } from "lucide-react";

export function AppTopbar({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-8 backdrop-blur-xl bg-background/50 sticky top-0 z-30">
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base lg:text-lg font-display font-semibold text-white truncate">{title}</h2>
            {badge && (
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-ink-500 truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-xs text-ink-400 w-72">
          <Search className="size-3.5" />
          <span className="flex-1">Search courses, mentors, mocks...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-ink-400">
            <Command className="size-2.5" /> K
          </kbd>
        </div>
        <button className="relative size-9 rounded-lg glass-card grid place-items-center text-ink-300 hover:text-white transition-colors">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-brand-accent animate-pulse" />
        </button>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity" />
          <div className="relative size-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 ring-2 ring-background flex items-center justify-center text-xs font-bold text-white">
            SC
          </div>
        </div>
      </div>
    </header>
  );
}
