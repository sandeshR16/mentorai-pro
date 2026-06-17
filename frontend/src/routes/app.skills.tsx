import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Sparkles, ArrowUpRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/skills")({
  head: () => ({ meta: [{ title: "Skill Gap Analysis — MentorAI" }] }),
  component: Skills,
});

interface UserSkills {
  coding: number;
  aptitude: number;
  communication: number;
}

interface GapReport {
  weakAreas: string[];
  recommendations: string[];
  interviewScore: number;
}

function Skills() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<UserSkills>({ coding: 50, aptitude: 50, communication: 50 });
  const [gapReport, setGapReport] = useState<GapReport | null>(null);

  useEffect(() => {
    fetchSkillsAndGaps();
  }, []);

  const fetchSkillsAndGaps = async () => {
    try {
      const profileRes = await api.get("/profile/me");
      const fetchedSkills = profileRes.data.skills || { coding: 50, aptitude: 50, communication: 50 };
      setSkills(fetchedSkills);

      const mockScore = profileRes.data.interviews?.[0]?.score || 5;

      const gapRes = await api.post("/skill-gap/analyze", {
        coding: fetchedSkills.coding,
        aptitude: fetchedSkills.aptitude,
        communication: fetchedSkills.communication,
        interviewScore: mockScore
      });
      setGapReport(gapRes.data);
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
        <span className="text-sm text-ink-400 font-medium">Loading Skill matrix...</span>
      </div>
    );
  }

  // Format dynamic data matching user skills
  const skillsList = [
    { skill: "Coding & DSA", value: skills.coding, benchmark: 70 },
    { skill: "Aptitude Tests", value: skills.aptitude, benchmark: 70 },
    { skill: "Communication", value: skills.communication, benchmark: 70 },
    { skill: "Mock Interview", value: (gapReport?.interviewScore || 5.0) * 10, benchmark: 70 },
  ];

  const strengths = skillsList.filter((s) => s.value >= s.benchmark);
  const gaps = skillsList.filter((s) => s.value < s.benchmark);

  // Overall metric index
  const averageMetric = Math.round((skills.coding + skills.aptitude + skills.communication) / 3);

  return (
    <>
      <AppTopbar title="Skill Gap Analysis" subtitle="Benchmarked against industry entry standard scores (70%)" badge="Active Audit" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-up">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar chart */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-display font-semibold text-white">Skill Matrix</h3>
            <p className="text-xs text-ink-500 mt-1">Indigo = you &bull; Slate = Standard target threshold (70%)</p>
            
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsList}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <RechartsRadar dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.15} />
                  <RechartsRadar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} strokeWidth={2.5} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">Overall Proficiency Median</p>
              <p className="font-display text-4xl font-bold text-white mt-2">{averageMetric}<span className="text-ink-500 text-2xl">/100</span></p>
              <p className="text-xs text-brand-accent font-mono mt-1">
                {averageMetric >= 70 ? "Excellent. Above entrance targets" : "Requires remedial practice"}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border-brand-primary/20 bg-brand-primary/5">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-brand-primary/20 grid place-items-center shrink-0">
                  <Sparkles className="size-4 text-brand-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">AI Placement Recommendations</p>
                  
                  {gapReport && gapReport.recommendations?.length > 0 ? (
                    <ul className="space-y-2 mt-2">
                      {gapReport.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-ink-300 flex items-start gap-1.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-brand-accent rounded-full mt-1.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-ink-400 mt-1 leading-relaxed">Excellent alignment! Review mock interviews log before placements start.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillList title="Strengths (>= 70%)" items={strengths} positive />
          <SkillList title="Gaps to close (< 70%)" items={gaps} />
        </div>

        {/* Comparative Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-white">Direct Gap Comparison</h3>
          <p className="text-xs text-ink-500 mt-0.5 mb-4">Visualize exact delta deviations from entry target benchmarks</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsList} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="skill" stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="benchmark" fill="#334155" name="Target Target" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" fill="#6366f1" name="Your Level" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </>
  );
}

function SkillList({ title, items, positive }: { title: string; items: any[]; positive?: boolean }) {
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
