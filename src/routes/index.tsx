import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Target, Radar, Trophy, Zap, Brain, BarChart3, Star, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MentorAI — The engineering career engine" },
      { name: "description", content: "AI mentor that simulates real interviews, identifies skill gaps, and gets engineering students placement-ready at Tier-1 companies." },
      { property: "og:title", content: "MentorAI — The engineering career engine" },
      { property: "og:description", content: "AI mentor that simulates real interviews, identifies skill gaps, and gets engineering students placement-ready." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <PlacementMetrics />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <div className="size-3.5 bg-white/30 rounded-sm rotate-45" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">MentorAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-ink-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Product</a>
          <a href="#metrics" className="hover:text-white transition-colors">Outcomes</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Students</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth/sign-in" className="text-sm font-medium text-ink-300 hover:text-white transition-colors px-3 py-1.5">Log in</Link>
          <Link to="/app/dashboard" className="text-sm font-medium bg-white text-ink-950 hover:bg-ink-100 px-4 py-2 rounded-lg transition-all shadow-lg shadow-white/5">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-20 pb-28 px-6 mesh-bg">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <span className="size-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-brand-primary">Placement Season '24 · Live</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white text-balance mb-6">
            The engineering <span className="gradient-text">career engine.</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-400 max-w-[52ch] leading-relaxed mb-10 text-pretty">
            Skip generic tutorials. Train with an AI mentor that simulates real FAANG interviews, pinpoints your skill gaps, and guarantees placement readiness.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/app/dashboard"
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-semibold rounded-lg shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-0.5 transition-all"
            >
              Start training free
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 glass-card text-ink-200 font-medium rounded-lg hover:text-white transition-colors">
              Watch demo
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-ink-500">
            <div className="flex -space-x-2">
              {["from-indigo-400 to-violet-500", "from-cyan-400 to-blue-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500"].map((g, i) => (
                <div key={i} className={`size-7 rounded-full bg-gradient-to-br ${g} ring-2 ring-background`} />
              ))}
            </div>
            <div>
              <span className="text-white font-semibold">4,200+</span> students placed this season
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="absolute -inset-8 bg-gradient-to-tr from-brand-primary/20 via-brand-secondary/15 to-brand-accent/10 blur-3xl opacity-60" />
          <div className="relative glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="px-4 py-3 border-b border-border bg-ink-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-xs font-medium text-ink-300">AI Mentor · Live Session</span>
              </div>
              <span className="text-[10px] font-mono text-ink-500 uppercase tracking-widest">Mentor-GPT 4.0</span>
            </div>
            <div className="p-5 space-y-4 h-[400px] overflow-hidden">
              <ChatBubble role="ai">
                I analyzed your GitHub. Strong React, but gaps in distributed systems. Ready for a system design mock?
              </ChatBubble>
              <ChatBubble role="me">
                Yes — focus on global notification fan-out at 10M concurrent users.
              </ChatBubble>
              <ChatBubble role="ai">
                Good. Walk me through your write-path. Consider Kafka partitioning, idempotency, and your consistency model.
              </ChatBubble>
              <div className="flex items-center gap-2 pl-11">
                <span className="size-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="size-1.5 rounded-full bg-brand-primary animate-pulse [animation-delay:200ms]" />
                <span className="size-1.5 rounded-full bg-brand-primary animate-pulse [animation-delay:400ms]" />
                <span className="text-xs text-ink-500 font-mono">analyzing...</span>
              </div>
            </div>
            <div className="p-3 border-t border-border bg-ink-900/40">
              <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
                <input className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-ink-600" placeholder="Type your approach..." />
                <button className="size-7 rounded-md bg-brand-primary grid place-items-center text-white">
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, children }: { role: "ai" | "me"; children: React.ReactNode }) {
  const isAi = role === "ai";
  return (
    <div className={`flex gap-3 ${isAi ? "" : "flex-row-reverse"}`}>
      <div className={`size-8 rounded-lg flex-shrink-0 grid place-items-center text-xs font-bold ${isAi ? "bg-brand-primary/20 text-brand-primary" : "bg-brand-secondary/20 text-brand-secondary"}`}>
        {isAi ? "AI" : "ME"}
      </div>
      <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${isAi ? "bg-white/5 text-ink-200 rounded-tl-none" : "bg-brand-primary text-white rounded-tr-none"}`}>
        {children}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { v: "92%", l: "Placement Rate" },
    { v: "₹18.4 LPA", l: "Avg. CTC" },
    { v: "12,400+", l: "Mock Interviews" },
    { v: "4.9/5", l: "Mentor Rating" },
  ];
  return (
    <section className="border-y border-border bg-ink-900/30 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.l} className="text-center md:text-left">
            <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">{s.v}</div>
            <div className="text-[10px] mt-1 font-mono uppercase tracking-widest text-ink-500">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Brain, color: "primary", title: "Adaptive AI Mentor", desc: "Fine-tuned on 50k+ verified interview transcripts. Knows the exact patterns Google, Meta, Stripe ask." },
    { icon: Target, color: "secondary", title: "Predictive Readiness Index", desc: "Know which companies will shortlist you before you apply. Granular benchmark scoring across 40+ sub-skills." },
    { icon: Mic, color: "accent", title: "Hyper-local Simulators", desc: "Mock interviews that replicate the exact stacks and questioning style of Tier-1 product companies." },
    { icon: Radar, color: "primary", title: "Skill Gap Analysis", desc: "Live radar of strengths and weaknesses, benchmarked against last year's placed batch from your college." },
    { icon: Trophy, color: "secondary", title: "Gamified Progression", desc: "XP, streaks, badges, and a college leaderboard that turns daily prep into competitive momentum." },
    { icon: BarChart3, color: "accent", title: "Career Roadmap", desc: "Timeline-based path to your dream offer with milestones, certifications, and weekly accountability." },
  ];
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-3">// PRODUCT</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Everything an engineer needs to land the offer.</h2>
          <p className="text-ink-400 text-lg">Six surfaces, one platform. Built for the rigor of Tier-1 placement seasons.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            const colorMap: Record<string, string> = {
              primary: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
              secondary: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20",
              accent: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
            };
            return (
              <div key={f.title} className="group relative glass-card rounded-2xl p-7 hover:-translate-y-1 hover:border-white/15 transition-all">
                <div className={`size-11 rounded-xl border grid place-items-center mb-5 ${colorMap[f.color]}`}>
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Mic({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
}

function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-secondary mb-3">// THE COCKPIT</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Mission-control for your career.</h2>
          <p className="text-ink-400 text-lg">Real-time telemetry of your engineering readiness — 40+ tracked sub-skills, benchmarked weekly.</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-x-12 -inset-y-8 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/10 blur-3xl" />
          <div className="relative glass-panel rounded-2xl p-3 lg:p-4 shadow-2xl shadow-black/40">
            <div className="rounded-xl border border-border bg-ink-900/40 overflow-hidden">
              <div className="grid grid-cols-12 min-h-[460px]">
                {/* mini sidebar */}
                <div className="hidden md:block col-span-3 lg:col-span-2 border-r border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="size-7 rounded-md bg-gradient-to-br from-brand-primary to-brand-secondary" />
                    <span className="font-display font-bold text-sm text-white">MentorAI</span>
                  </div>
                  {["Dashboard", "AI Mentor", "Interviews", "Skills", "Roadmap"].map((l, i) => (
                    <div key={l} className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-2 ${i === 0 ? "bg-brand-primary/10 text-white border border-brand-primary/20" : "text-ink-500"}`}>
                      <span className={`size-1 rounded-full ${i === 0 ? "bg-brand-primary" : "bg-ink-700"}`} />
                      {l}
                    </div>
                  ))}
                </div>
                {/* main */}
                <div className="col-span-12 md:col-span-9 lg:col-span-10 p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ l: "Readiness", v: "84", s: "+12%" }, { l: "Streak", v: "14d", s: "🔥" }, { l: "XP", v: "8.4k", s: "#12" }].map((c) => (
                      <div key={c.l} className="glass-card rounded-lg p-3">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">{c.l}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-display font-bold text-xl text-white">{c.v}</span>
                          <span className="text-[10px] text-brand-accent">{c.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 glass-card rounded-lg p-4 h-48 relative overflow-hidden">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-2">Weekly XP</p>
                      <div className="absolute inset-x-4 bottom-4 flex items-end gap-2 h-32">
                        {[40, 55, 78, 82, 60, 95, 70].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-primary to-brand-secondary/60" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="glass-card rounded-lg p-4 h-48">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Skill Matrix</p>
                      <div className="space-y-2.5">
                        {[{ l: "DSA", v: 92, c: "bg-brand-accent" }, { l: "System", v: 74, c: "bg-brand-primary" }, { l: "Comms", v: 81, c: "bg-brand-secondary" }].map((s) => (
                          <div key={s.l}>
                            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
                              <span>{s.l}</span><span className="font-mono">{s.v}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${s.c}`} style={{ width: `${s.v}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Aarav Mehta", role: "SDE @ Google", college: "IIT Bombay", text: "MentorAI's mock interviews were eerily close to my actual Google L4 loop. The system design feedback alone was worth it.", avatar: "from-indigo-500 to-violet-600" },
    { name: "Priya Reddy", role: "SDE-II @ Microsoft", college: "BITS Pilani", text: "The readiness index told me I wasn't ready for Stripe yet. 6 weeks later, I was — and I got the offer.", avatar: "from-cyan-500 to-blue-600" },
    { name: "Karan Shah", role: "Backend @ Atlassian", college: "NIT Trichy", text: "Skipped 4 expensive bootcamps because MentorAI did it better. The skill gap radar is unreal.", avatar: "from-emerald-500 to-teal-600" },
  ];
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-3">// PROOF</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Engineers who shipped their careers.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-0.5 text-brand-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="text-ink-200 leading-relaxed mb-6 text-pretty">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`size-10 rounded-full bg-gradient-to-br ${t.avatar}`} />
                <div>
                  <p className="font-medium text-white text-sm">{t.name}</p>
                  <p className="text-xs text-ink-500">{t.role} · {t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlacementMetrics() {
  return (
    <section id="metrics" className="py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-3">// OUTCOMES</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Numbers that <span className="gradient-text">incubators trust.</span>
          </h2>
          <p className="text-ink-400 text-lg mb-8">Deployed across 24 engineering campuses. Tracked outcomes, not vanity metrics.</p>
          <ul className="space-y-3">
            {[
              "92% Tier-1 placement rate across pilot cohorts",
              "Average CTC up 38% vs. pre-MentorAI graduating class",
              "1,420 verified FAANG / unicorn offers in 18 months",
              "ROI: 6x for partner colleges within 2 placement seasons",
            ].map((l) => (
              <li key={l} className="flex items-start gap-3 text-ink-300">
                <Check className="size-5 text-brand-accent shrink-0 mt-0.5" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel rounded-2xl p-8">
          <div className="grid grid-cols-2 gap-6">
            {[
              { v: "1,420", l: "Verified Offers", c: "text-brand-primary" },
              { v: "₹78L", l: "Highest CTC", c: "text-brand-secondary" },
              { v: "24", l: "Partner Colleges", c: "text-brand-accent" },
              { v: "184k", l: "Hours Trained", c: "text-amber-400" },
              { v: "94%", l: "Mock Accuracy", c: "text-brand-primary" },
              { v: "6.2x", l: "ROI Multiple", c: "text-brand-accent" },
            ].map((s) => (
              <div key={s.l} className="border border-border rounded-xl p-5 bg-ink-900/30">
                <div className={`font-display text-3xl font-bold ${s.c}`}>{s.v}</div>
                <div className="text-xs text-ink-500 mt-1 font-mono uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden mesh-bg border-t border-border">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
          <Sparkles className="size-3 text-brand-accent" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-brand-accent">Free for university partnerships</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">Your dream offer starts tonight.</h2>
        <p className="text-ink-400 text-lg mb-10 max-w-xl mx-auto">Join 12,000+ engineers building careers with intelligent guidance. Free forever for students.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input type="email" placeholder="your.name@college.edu" className="flex-1 px-4 py-3 rounded-lg glass-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 placeholder:text-ink-600" />
          <Link to="/auth/sign-up" className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-soft transition-colors shadow-lg shadow-brand-primary/30">
            Claim seat
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-gradient-to-br from-brand-primary to-brand-secondary" />
          <span className="font-display font-bold text-white">MentorAI</span>
          <span className="text-xs text-ink-600 font-mono ml-2">© 2024</span>
        </div>
        <div className="flex gap-6 text-xs text-ink-500">
          <a href="#" className="hover:text-ink-200">Privacy</a>
          <a href="#" className="hover:text-ink-200">Terms</a>
          <a href="#" className="hover:text-ink-200">Changelog</a>
          <a href="#" className="hover:text-ink-200">Status</a>
          <a href="#" className="hover:text-ink-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}
