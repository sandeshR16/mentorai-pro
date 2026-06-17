import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

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

export function SocialButtons({ onSelect }: { onSelect?: (provider: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {["Google", "GitHub", "LinkedIn"].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onSelect?.(p)}
          className="glass-card rounded-lg py-2.5 text-xs font-medium text-ink-200 hover:text-white hover:border-white/15 transition-all cursor-pointer"
        >
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

export function Field({ label, type = "text", placeholder, value, onChange, required }: { label: string; type?: string; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-ink-300">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} className="w-full glass-card rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all" />
    </div>
  );
}

export function SocialAuthModal({
  isOpen,
  onClose,
  provider,
  onAuthenticate
}: {
  isOpen: boolean;
  onClose: () => void;
  provider: string;
  onAuthenticate: (email: string, name: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      onAuthenticate(email, name || email.split("@")[0]);
      setLoading(false);
      onClose();
    }, 1200);
  };

  const selectPredefined = (preEmail: string, preName: string) => {
    setLoading(true);
    setTimeout(() => {
      onAuthenticate(preEmail, preName);
      setLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm glass-card border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent animate-pulse" />
        
        <h3 className="font-display font-bold text-lg text-white mb-1">
          Sign in with {provider}
        </h3>
        <p className="text-xs text-ink-400 mb-6">to continue to MentorAI</p>

        {loading ? (
          <div className="py-12 flex flex-col justify-center items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <span className="text-xs text-ink-300 font-medium font-mono">Connecting securely to {provider}...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">// Choose account</p>
              <button
                type="button"
                onClick={() => selectPredefined(`student.${provider.toLowerCase()}@college.edu`, `Demo ${provider} User`)}
                className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 transition-all flex items-center gap-3 cursor-pointer"
              >
                <div className="size-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-xs text-brand-primary">
                  {provider.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Demo {provider} User</p>
                  <p className="text-[10px] text-ink-500">student.${provider.toLowerCase()}@college.edu</p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[9px] font-mono text-ink-500 uppercase tracking-widest">or add account</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink-500 block mb-1">Email address</label>
                <input
                  type="email"
                  placeholder={`you@${provider.toLowerCase()}.com`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-ink-600 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-ink-500 block mb-1">Full name (optional)</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-ink-600 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-semibold text-ink-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-soft cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

