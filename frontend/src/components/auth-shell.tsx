import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background mesh-bg">
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-border">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/30" />
            <span className="font-display font-bold text-lg text-white">MentorAI</span>
          </Link>
          <div className="space-y-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary">// Trusted by</p>
            <h2 className="font-display text-3xl font-bold text-white max-w-md text-balance">
              "I went from <span className="gradient-text">unsure</span> to a Google L4 offer in 14 weeks."
            </h2>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
              <div>
                <p className="text-sm font-medium text-white">Aarav Mehta</p>
                <p className="text-xs text-ink-500">SDE @ Google · IIT Bombay '24</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-8 border-t border-border max-w-md">
              {[{ v: "92%", l: "Placed" }, { v: "₹18L", l: "Avg CTC" }, { v: "4.9★", l: "Rating" }].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-xl font-bold text-white">{s.v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-600 font-mono">© 2024 MentorAI Systems Inc.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary" />
            <span className="font-display font-bold text-lg text-white">MentorAI</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-2">{title}</h1>
          <p className="text-ink-400 mb-8">{subtitle}</p>
          {children}
          <div className="mt-8 text-center text-sm text-ink-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {["Google", "GitHub", "LinkedIn"].map((p) => (
        <button key={p} className="glass-card rounded-lg py-2.5 text-xs font-medium text-ink-200 hover:text-white hover:border-white/15 transition-all">
          {p}
        </button>
      ))}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">or with email</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function Field({ label, type = "text", placeholder, value, onChange }: { label: string; type?: string; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-ink-300">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full glass-card rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all" />
    </div>
  );
}
