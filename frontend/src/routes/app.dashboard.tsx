import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, PolarRadiusAxis,
} from "recharts";
import { Flame, TrendingUp, Calendar, ArrowRight, Award, BookOpen, Mic, Target, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MentorAI" }] }),
  component: Dashboard,
});

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  readinessScore: number;
}

interface UserSkills {
  coding: number;
  aptitude: number;
  communication: number;
}

interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

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

interface MockInterviewLog {
  _id: string;
  type: string;
  question: string;
  score: number;
  createdAt: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<UserSkills>({ coding: 50, aptitude: 50, communication: 50 });
  const [interviews, setInterviews] = useState<MockInterviewLog[]>([]);
  const [gameStats, setGameStats] = useState<GamificationStats>({ xp: 10, level: 1, streak: 1, badges: ["Beginner"] });
  const [prediction, setPrediction] = useState<PlacementPrediction>({
    cgpa: 7.5,
    readinessScore: 50,
    companies: { tcs: 55, infosys: 50, wipro: 47, accenture: 52 }
  });

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      // 1. Profile, skills, and past mock logs
      const profileRes = await api.get("/profile/me");
      setUser(profileRes.data.user);
      setInterviews(profileRes.data.interviews || []);
      if (profileRes.data.skills) {
        setSkills(profileRes.data.skills);
      }

      // 2. Gamification Achievements
      const statsRes = await api.get("/gamification/stats");
      setGameStats(statsRes.data);

      // 3. Selection predictions
      const latestPredict = await api.get("/placement/latest");
      setPrediction(latestPredict.data);

    } catch (err) {
      console.warn("Could not load metrics from backend. Checking for cached local user fallback...");
      
      const localUserStr = localStorage.getItem("user");
      if (localUserStr) {
        const localUserObj = JSON.parse(localUserStr);
        setUser(localUserObj);
        
        // Populate standard mock data when backend is unreachable/offline
        setSkills({ coding: 65, aptitude: 60, communication: 80 });
        setGameStats({ xp: 120, level: 2, streak: 3, badges: ["Beginner"] });
        setPrediction({
          cgpa: 8.2,
          readinessScore: 74,
          companies: { tcs: 79, infosys: 74, wipro: 71, accenture: 76 }
        });
        setInterviews([
          { _id: "1", type: "TECHNICAL", question: "Explain OOP concepts.", score: 8, createdAt: new Date().toISOString() },
          { _id: "2", type: "HR", question: "Tell me about yourself.", score: 7, createdAt: new Date().toISOString() }
        ]);
      } else {
        localStorage.clear();
        navigate({ to: "/auth/sign-in" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Format Radar data based on dynamic student skills
  const radarData = [
    { skill: "Coding & DSA", value: skills.coding, benchmark: 70 },
    { skill: "Aptitude", value: skills.aptitude, benchmark: 70 },
    { skill: "Communication", value: skills.communication, benchmark: 70 },
    { skill: "System Design", value: 65, benchmark: 60 },
    { skill: "DBMS & OS", value: 60, benchmark: 65 },
  ];

  // Dynamic Learning Path Suggestions based on skill level gaps
  const paths = [
    {
      title: "Data Structures & Algorithms gauntlet",
      progress: skills.coding,
      tag: "Coding Gap",
      desc: skills.coding < 70 ? "Practice DSA daily (Recursion, Trees, Dynamic Programming)" : "Maintain consistency"
    },
    {
      title: "Quantitative & Logical Reasoning Track",
      progress: skills.aptitude,
      tag: "Aptitude Gap",
      desc: skills.aptitude < 70 ? "Solve aptitude mock tests on logical reasoning" : "Practice intermediate topics"
    },
    {
      title: "Speech & Behavioral Simulator",
      progress: skills.communication,
      tag: "Communication Gap",
      desc: skills.communication < 70 ? "Practice mock standard pitches and mock interview rounds" : "Prepare case studies"
    }
  ];

  return (
    <>
      <AppTopbar 
        title={`Welcome back, ${user?.name || "Student"}`} 
        subtitle={`Your placement readiness calculated from ${user?.branch || "CSE"} parameters`} 
        badge={prediction.readinessScore >= 75 ? "Tier 1 Candidate" : "Placement Preparing"} 
      />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        
        {/* KPI Score Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
          {/* Readiness */}
          <div className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="size-9 rounded-lg border grid place-items-center text-brand-primary bg-brand-primary/10 border-brand-primary/20">
                <Target className="size-4" strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-xs text-ink-500 font-medium">Placement Readiness</p>
            <p className="font-display text-3xl font-bold text-white mt-1 tracking-tight">{prediction.readinessScore}%</p>
            <p className="text-[10px] text-brand-accent mt-2 font-mono">Based on CGPA & Skills</p>
          </div>

          {/* Streak */}
          <div className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="size-9 rounded-lg border grid place-items-center text-amber-400 bg-amber-400/10 border-amber-400/20">
                <Flame className="size-4" strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-xs text-ink-500 font-medium">Learning Streak</p>
            <p className="font-display text-3xl font-bold text-white mt-1 tracking-tight">{gameStats.streak}d</p>
            <p className="text-[10px] text-ink-400 mt-2 font-mono">Consistently Active</p>
          </div>

          {/* XP */}
          <div className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="size-9 rounded-lg border grid place-items-center text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20">
                <TrendingUp className="size-4" strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-xs text-ink-500 font-medium">XP Achievements</p>
            <p className="font-display text-3xl font-bold text-white mt-1 tracking-tight">{gameStats.xp} XP</p>
            <p className="text-[10px] text-ink-400 mt-2 font-mono">Level {gameStats.level} Rank</p>
          </div>

          {/* Mocks */}
          <div className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="size-9 rounded-lg border grid place-items-center text-brand-accent bg-brand-accent/10 border-brand-accent/20">
                <Mic className="size-4" strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-xs text-ink-500 font-medium">Mock Mocks Logged</p>
            <p className="font-display text-3xl font-bold text-white mt-1 tracking-tight">{interviews.length}</p>
            <p className="text-[10px] text-ink-400 mt-2 font-mono">Verify attempts below</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Company Selection Gauge List */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white">MNC Selection Probabilities</h3>
              <p className="text-xs text-ink-500 mt-0.5 mb-6">Percentage likelihood of clearing company screening rounds</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* TCS */}
                <div className="border border-border bg-white/2 p-4 rounded-xl text-center space-y-3">
                  <div className="text-xs font-bold text-slate-300">TCS Round</div>
                  <div className="text-2xl font-extrabold text-red-400">{prediction.companies.tcs}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${prediction.companies.tcs}%` }} className="bg-red-400 h-full rounded-full" />
                  </div>
                </div>
                {/* Infosys */}
                <div className="border border-border bg-white/2 p-4 rounded-xl text-center space-y-3">
                  <div className="text-xs font-bold text-slate-300">Infosys Round</div>
                  <div className="text-2xl font-extrabold text-blue-400">{prediction.companies.infosys}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${prediction.companies.infosys}%` }} className="bg-blue-400 h-full rounded-full" />
                  </div>
                </div>
                {/* Wipro */}
                <div className="border border-border bg-white/2 p-4 rounded-xl text-center space-y-3">
                  <div className="text-xs font-bold text-slate-300">Wipro Round</div>
                  <div className="text-2xl font-extrabold text-purple-400">{prediction.companies.wipro}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${prediction.companies.wipro}%` }} className="bg-purple-400 h-full rounded-full" />
                  </div>
                </div>
                {/* Accenture */}
                <div className="border border-border bg-white/2 p-4 rounded-xl text-center space-y-3">
                  <div className="text-xs font-bold text-slate-300">Accenture Round</div>
                  <div className="text-2xl font-extrabold text-emerald-400">{prediction.companies.accenture}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${prediction.companies.accenture}%` }} className="bg-emerald-400 h-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Learning Path recommendations */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h3 className="font-display font-semibold text-white">Recommended Study Roadmap</h3>
                  <p className="text-xs text-ink-500 mt-0.5">Custom remedial paths matching your skill gap report</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {paths.map((p, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 group hover:bg-white/2 transition-colors">
                    <div className="size-10 rounded-lg bg-white/5 border border-border grid place-items-center font-mono text-xs text-ink-400 shrink-0">
                      0{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.title}</p>
                      <p className="text-xs text-ink-500 mt-1">{p.desc}</p>
                    </div>
                    <div className="w-32 hidden md:block">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${p.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-ink-500 mt-1 font-mono text-right">{p.progress}% level</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            {/* Skills Radar Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-1">Skills Radar</h3>
              <p className="text-xs text-ink-500 mb-4">Your levels vs benchmark targets</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <RechartsRadar dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                    <RechartsRadar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Simulated Interviews Logs */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-4">Recent Simulations</h3>
              {interviews.length === 0 ? (
                <div className="text-center py-6 text-ink-600 text-xs">
                  No mock reviews complete yet.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {interviews.slice(0, 5).map((a) => (
                    <div key={a._id} className="flex items-start gap-3">
                      <div className="size-7 rounded-md bg-white/5 grid place-items-center text-ink-400 shrink-0">
                        <Mic className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{a.question}</p>
                        <p className="text-[10px] text-ink-500 mt-0.5">{a.type} &bull; {new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brand-accent">{a.score * 10}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
