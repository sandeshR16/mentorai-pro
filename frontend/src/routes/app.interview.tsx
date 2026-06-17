import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useState } from "react";
import { Mic, Play, Clock, Building2, Briefcase, Users, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/app/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — MentorAI" }] }),
  component: Interview,
});

interface EvaluationReport {
  score: number;
  question: string;
  answer: string;
  feedback: string; // JSON string
  parsedFeedback?: {
    score?: number;
    strengths?: string;
    weaknesses?: string;
    improvementTips?: string;
  };
}

function Interview() {
  const [stage, setStage] = useState<"setup" | "live" | "report">("setup");
  const [type, setType] = useState<string>("TECHNICAL");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<EvaluationReport | null>(null);

  const startInterview = async (selectedType: string) => {
    setLoading(true);
    setAnswer("");
    setReport(null);
    try {
      const res = await api.post("/interview/question", { type: selectedType });
      setQuestion(res.data.question);
      setType(selectedType);
      setStage("live");
    } catch (err) {
      console.error(err);
      alert("Error starting interview simulator. Please verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/interview/submit", {
        type,
        question,
        answer
      });
      
      let parsedFeedback = {};
      try {
        parsedFeedback = JSON.parse(res.data.feedback);
      } catch {
        parsedFeedback = {
          score: res.data.score,
          strengths: "Response logged successfully.",
          weaknesses: res.data.feedback,
          improvementTips: "Try structuring your points with technical highlights."
        };
      }

      setReport({
        ...res.data,
        parsedFeedback
      });

      // Claim reward XP
      await api.post("/gamification/xp", { xp: 35 });

      setStage("report");
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate mock response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppTopbar title="Mock Interview Simulator" subtitle="Replicates real Tier-1 company interview formats" badge="AI Examiner" />
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {stage === "setup" && (
          <SetupScreen 
            onStart={(selType) => startInterview(selType)} 
            loading={loading} 
          />
        )}
        {stage === "live" && (
          <LiveScreen 
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={submitAnswer}
            loading={loading}
            onCancel={() => setStage("setup")}
          />
        )}
        {stage === "report" && report && (
          <ReportScreen 
            report={report}
            onRestart={() => setStage("setup")} 
          />
        )}
      </div>
    </>
  );
}

function SetupScreen({ onStart, loading }: { onStart: (type: string) => void; loading: boolean }) {
  const [mode, setMode] = useState<"hr" | "technical" | "company">("technical");
  const [company, setCompany] = useState<string>("TCS");

  const modes = [
    { id: "hr", title: "HR Interview", desc: "Behavioral, motivation, culture-fit", icon: Users, color: "secondary", time: "20 min", dbType: "HR" },
    { id: "technical", title: "Technical Round", desc: "DSA, system design, code-along", icon: Briefcase, color: "primary", time: "45 min", dbType: "TECHNICAL" },
    { id: "company", title: "Company-Specific", desc: "TCS, Wipro, Infosys mock criteria", icon: Building2, color: "accent", time: "60 min", dbType: "SITUATIONAL" },
  ] as const;

  const colorMap: Record<string, string> = {
    primary: "border-brand-primary/45 bg-brand-primary/5",
    secondary: "border-brand-secondary/45 bg-brand-secondary/5",
    accent: "border-brand-accent/45 bg-brand-accent/5",
  };

  const handleStart = () => {
    if (mode === "company") {
      onStart(company.toUpperCase());
    } else {
      const selected = modes.find((m) => m.id === mode);
      onStart(selected?.dbType || "TECHNICAL");
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">Configure your session</h3>
        <p className="text-ink-400">Pick a mode. Our AI examiner adjusts difficulty based on your selected topic.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => setMode(m.id)} className={`text-left glass-card rounded-2xl p-6 transition-all ${active ? colorMap[m.color] + " ring-2 ring-brand-primary/30" : "hover:border-white/15"}`}>
              <div className="flex items-start justify-between mb-4">
                <Icon className={`size-6 ${active ? "text-brand-primary" : "text-ink-400"}`} />
                {active && <CheckCircle2 className="size-5 text-brand-accent" />}
              </div>
              <h4 className="font-display font-semibold text-white mb-1">{m.title}</h4>
              <p className="text-sm text-ink-400 mb-4">{m.desc}</p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 flex items-center gap-1.5">
                <Clock className="size-3" /> {m.time}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-white mb-4">Target Company / Template</h4>
          <div className="grid grid-cols-3 gap-2">
            {["TCS", "Infosys", "Wipro", "Situational", "Other"].map((c) => (
              <button 
                key={c} 
                type="button"
                onClick={() => {
                  setMode("company");
                  setCompany(c === "Situational" ? "SITUATIONAL" : c);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  mode === "company" && (company === c || (c === "Situational" && company === "SITUATIONAL"))
                    ? "bg-brand-primary/10 border-brand-primary/35 text-white" 
                    : "border-border text-ink-400 hover:text-white hover:border-white/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-white mb-4">Level Standard</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-brand-primary/30 bg-brand-primary/10">
              <span className="size-4 rounded-full border-2 border-brand-primary grid place-items-center">
                <span className="size-2 rounded-full bg-brand-primary" />
              </span>
              <span className="text-sm text-white">Undergraduate Placement Round</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleStart} 
        disabled={loading}
        className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all flex items-center gap-2 justify-center cursor-pointer disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="size-4 fill-current" />}
        <span>Start mock interview (+35 XP)</span>
      </button>
    </div>
  );
}

function LiveScreen({ 
  question, 
  answer, 
  setAnswer, 
  onSubmit, 
  loading,
  onCancel 
}: { 
  question: string; 
  answer: string; 
  setAnswer: (a: string) => void; 
  onSubmit: () => void; 
  loading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between glass-card rounded-2xl px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary grid place-items-center text-white font-bold text-sm">AI</div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-brand-accent border-2 border-background animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">AI Examiner Mei</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-accent">Awaiting Answer Submission</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-white/5 border border-border text-ink-300 text-sm font-semibold hover:bg-white/10 transition-colors">
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Question Display */}
          <div className="glass-card rounded-2xl p-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary">Interview Question</span>
            <h3 className="font-display text-lg lg:text-xl text-white leading-snug mt-2">
              {question}
            </h3>
          </div>

          {/* Response Textarea */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-ink-400">Your Answer Input</p>
              <Mic className="size-4 text-brand-accent animate-pulse" />
            </div>
            <textarea
              required
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your response with definitions and examples..."
              className="w-full bg-[#0a0f1d] border border-border rounded-xl p-4 text-sm font-mono text-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 leading-relaxed resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Evaluator Criteria</p>
            <div className="space-y-3">
              {[
                { l: "Clarity & Grammar", v: 85, c: "bg-brand-accent" },
                { l: "Technical Context", v: 75, c: "bg-brand-primary" },
                { l: "Fluency & Depth", v: 80, c: "bg-brand-secondary" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-400">{s.l}</span>
                    <span className="font-mono text-white">{s.v}% target</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.c} transition-all`} style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onSubmit} 
            disabled={loading || !answer.trim()}
            className="w-full py-4 bg-brand-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-primary-soft transition-colors disabled:opacity-40 cursor-pointer shadow-lg shadow-brand-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
              </>
            ) : (
              <>
                Submit Answer <Send className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({ report, onRestart }: { report: EvaluationReport; onRestart: () => void }) {
  const pFeedback = report.parsedFeedback || {};
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-2">// Session Report</p>
            <h3 className="font-display text-3xl font-bold text-white">Evaluation complete.</h3>
            <p className="text-ink-400 mt-1">Topic Round Standard &bull; Claimed +35 XP points</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display text-6xl font-bold gradient-text leading-none">{report.score * 10}</span>
            <span className="text-ink-400 mb-2">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5">
          <h4 className="font-display font-semibold text-white">AI Examiner Feedback</h4>
          
          <div className="border-l-2 pl-4 py-1 border-emerald-500">
            <p className="text-sm font-medium text-emerald-400">Strengths</p>
            <p className="text-xs text-ink-300 mt-1 leading-relaxed">{pFeedback.strengths || "functional response structure."}</p>
          </div>

          <div className="border-l-2 pl-4 py-1 border-amber-500">
            <p className="text-sm font-medium text-amber-400">Weaknesses / Areas of Gaps</p>
            <p className="text-xs text-ink-300 mt-1 leading-relaxed">{pFeedback.weaknesses || "could explore more technical details."}</p>
          </div>

          <div className="border-l-2 pl-4 py-1 border-brand-primary">
            <p className="text-sm font-medium text-brand-primary">Actionable Improvement Tips</p>
            <p className="text-xs text-ink-300 mt-1 leading-relaxed">{pFeedback.improvementTips || "practice more mock interview sessions."}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">Your Submission</p>
            <p className="text-xs text-ink-400 leading-relaxed italic bg-black/20 p-3 rounded-lg border border-white/5 max-h-40 overflow-y-auto">
              "{report.answer}"
            </p>
          </div>
          
          <button onClick={onRestart} className="w-full px-5 py-3 bg-brand-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-primary-soft transition-colors cursor-pointer">
            Start Another Simulation <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
