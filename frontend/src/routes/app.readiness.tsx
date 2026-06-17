import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/readiness")({
  head: () => ({ meta: [{ title: "Placement Readiness — MentorAI" }] }),
  component: Readiness,
});

interface PlacementPrediction {
  cgpa: number;
  readinessScore: number;
  companies: {
    tcs: number;
    infosys: number;
    wipro: number;
    accenture: number;
  };
}

function Readiness() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<PlacementPrediction | null>(null);

  useEffect(() => {
    fetchReadiness();
  }, []);

  const fetchReadiness = async () => {
    try {
      const res = await api.get("/placement/latest");
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      localStorage.clear();
      navigate({ to: "/auth/sign-in" });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !prediction) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-3 bg-background">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <span className="text-sm text-ink-400 font-medium">Computing Placement Readiness...</span>
      </div>
    );
  }

  const companiesList = [
    { name: "TCS Round", value: prediction.companies.tcs },
    { name: "Infosys Round", value: prediction.companies.infosys },
    { name: "Accenture", value: prediction.companies.accenture },
    { name: "Wipro Standard", value: prediction.companies.wipro },
  ];

  return (
    <>
      <AppTopbar title="Placement Readiness" subtitle="Predictive selection probability based on active academic profile" badge="Active Prediction" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-up">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadinessRing score={prediction.readinessScore} />
          
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white">Selection Probability by Corporation</h3>
            <p className="text-xs text-ink-500 mt-1 mb-4">Calculated from aggregated mock performance and CGPA: {prediction.cgpa}</p>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companiesList} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" style={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <EligibilityTracker list={companiesList} />
        <Insights score={prediction.readinessScore} />
      </div>
    </>
  );
}

function ReadinessRing({ score }: { score: number }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-4">Aggregated Readiness Index</p>
      <div className="relative size-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="78%" outerRadius="100%" data={[{ value: score, fill: "#6366f1" }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "rgba(255,255,255,0.05)" } as any} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <div className="font-display text-5xl font-bold gradient-text leading-none">{score}</div>
            <div className="text-xs text-ink-500 mt-1 font-mono uppercase tracking-widest font-bold">of 100</div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink-300">Entrance Threshold is **70%**</p>
      <p className="text-[10px] font-mono text-brand-accent mt-1">
        {score >= 70 ? "Ready for selection" : "grind DSA & mock interviews to improve"}
      </p>
    </div>
  );
}

function EligibilityTracker({ list }: { list: any[] }) {
  const map = { ready: { Icon: CheckCircle2, c: "text-brand-accent" }, almost: { Icon: AlertTriangle, c: "text-amber-400" }, gap: { Icon: XCircle, c: "text-destructive" } } as const;
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-white">Target Screening Status</h3>
          <p className="text-xs text-ink-500">Auto calculated against placement standards</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {list.map((r) => {
          const status = r.value >= 75 ? "ready" : r.value >= 60 ? "almost" : "gap";
          const { Icon, c } = map[status];
          const note = status === "ready" ? "Eligible. Strong probability" : status === "almost" ? "Prepare specialized questions" : "Urgent gap closure needed";
          
          return (
            <div key={r.name} className="px-6 py-4 grid grid-cols-12 items-center gap-4">
              <div className="col-span-3 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-white/5 border border-border grid place-items-center text-xs font-bold text-white">{r.name[0]}</div>
                <div>
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <p className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">MNC Technical Round</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${c}`} />
                  <span className={`text-xs font-medium ${c} capitalize`}>{status}</span>
                </div>
              </div>
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${r.value}%` }} />
                  </div>
                  <span className="text-xs font-mono text-white w-8 text-right">{r.value}%</span>
                </div>
              </div>
              <div className="col-span-3 text-right">
                <p className="text-xs text-ink-400">{note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Insights({ score }: { score: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "Placement Trajectory", body: score >= 70 ? "Excellent pace! Maintain mock interview consistency." : "Target improving DSA and Mock scores to breach 70% threshold.", color: "primary" },
        { title: "MNC Selection Tips", body: "Focus on Wipro and Infosys situational round templates to secure easy backup offers.", color: "accent" },
        { title: "Gamification Reminder", body: "Complete more mock simulation templates to earn +35 XP and claim legendary badges.", color: "amber" },
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
