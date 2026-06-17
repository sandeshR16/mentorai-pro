import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Paperclip, FileText, Map, MessageSquare, History, Loader2 } from "lucide-react";
import { mentorPrompts } from "@/lib/mock-data";
import api from "@/lib/api";

export const Route = createFileRoute("/app/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — MentorAI" }] }),
  component: Mentor,
});

type Msg = { role: "ai" | "me"; text: string };

function Mentor() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hello! I am your AI Career Mentor. I can provide career guidance, technical learning roadmaps, and recommend skills. What is your career goal or question today?" }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userText = text;
    setInput("");
    setMessages((m) => [...m, { role: "me", text: userText }]);
    setLoading(true);

    try {
      const res = await api.post("/mentor/chat", { message: userText });
      setMessages((m) => [...m, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      console.warn("Backend mentor API unreachable. Generating client-side mock career response...");
      
      // Delay to simulate thinking animation
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockReply = getClientMockMentorReply(userText);
      setMessages((m) => [...m, { role: "ai", text: mockReply }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format system mentor markdown suggestions
  const formatText = (text: string) => {
    return (
      <div className="space-y-2 text-sm">
        {text.split("\n").map((line, idx) => {
          if (line.startsWith("###")) {
            return <h3 key={idx} className="font-extrabold text-white text-sm pt-2">{line.replace("###", "").trim()}</h3>;
          }
          if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
            return <p key={idx} className="font-bold text-slate-100 pl-1">{line}</p>;
          }
          if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
            return <li key={idx} className="list-disc pl-4 ml-2 text-ink-300">{line.replace(/^[-*]\s*/, "")}</li>;
          }
          return <p key={idx} className="text-ink-200 leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      <AppTopbar title="AI Mentor" subtitle="Mentor-GPT 4.0 · Powered by Together AI Llama 3.1" badge="Online" />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* History sidebar */}
        <aside className="hidden xl:flex w-72 shrink-0 border-r border-border flex-col p-4">
          <button 
            onClick={() => setMessages([{ role: "ai", text: "Hello! I am your AI Career Mentor. I can provide career guidance, technical learning roadmaps, and recommend skills. What is your career goal or question today?" }])}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold shadow-lg shadow-brand-primary/20 mb-4 cursor-pointer"
          >
            <Sparkles className="size-4" /> New conversation
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 px-2 mb-2 flex items-center gap-2"><History className="size-3" /> History</p>
          <div className="space-y-1 overflow-y-auto">
            {["System design for Google L4", "Resume review — backend roles", "DSA: dynamic programming", "Behavioral: conflict story"].map((t, i) => (
              <button key={i} onClick={() => send(`Explain and guide me on: ${t}`)} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors text-ink-400 hover:text-white hover:bg-white/5`}>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-border space-y-2">
            <button onClick={() => send("Generate a step-by-step career learning roadmap for me.")} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-ink-300 hover:bg-white/5 transition-colors cursor-pointer">
              <FileText className="size-3.5" /> Generate roadmap
            </button>
            <button onClick={() => send("How can I optimize my resume for placements?")} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-ink-300 hover:bg-white/5 transition-colors cursor-pointer">
              <Map className="size-3.5" /> Resume guidance
            </button>
          </div>
        </aside>

        {/* Chat window */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/25">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 animate-fade-up ${m.role === "me" ? "flex-row-reverse" : ""}`}>
                  <div className={`size-9 rounded-lg shrink-0 grid place-items-center text-xs font-bold ${m.role === "ai" ? "bg-gradient-to-br from-brand-primary to-brand-secondary text-white" : "bg-white/5 text-ink-300 border border-border"}`}>
                    {m.role === "ai" ? <Sparkles className="size-4" /> : "ME"}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${m.role === "ai" ? "glass-card text-ink-200 rounded-tl-none" : "bg-brand-primary text-white rounded-tr-none"}`}>
                    {m.role === "ai" ? formatText(m.text) : <p className="text-sm">{m.text}</p>}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 animate-fade-up">
                  <div className="size-9 rounded-lg shrink-0 grid place-items-center bg-gradient-to-br from-brand-primary to-brand-secondary text-white animate-pulse">
                    <Sparkles className="size-4 animate-spin" />
                  </div>
                  <div className="glass-card rounded-2xl px-4 py-3 text-sm text-ink-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-brand-primary animate-spin" />
                    <span>Mentor AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {messages.length === 1 && (
            <div className="max-w-3xl mx-auto w-full px-6 lg:px-8 pb-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-2 flex items-center gap-2"><MessageSquare className="size-3" /> Try asking</p>
              <div className="flex flex-wrap gap-2">
                {mentorPrompts.map((p) => (
                  <button key={p} onClick={() => send(p)} className="text-xs glass-card rounded-full px-3 py-1.5 text-ink-300 hover:text-white hover:border-brand-primary/30 transition-all cursor-pointer">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-4 bg-background/50 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="glass-card rounded-2xl p-2 flex items-end gap-2"
              >
                <button type="button" className="size-9 rounded-lg text-ink-400 hover:text-white hover:bg-white/5 grid place-items-center shrink-0">
                  <Paperclip className="size-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { 
                    if (e.key === "Enter" && !e.shiftKey) { 
                      e.preventDefault(); 
                      send(input); 
                    } 
                  }}
                  placeholder="Ask anything — career advice, mock me, draft a roadmap..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-white placeholder:text-ink-500 py-2"
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="size-9 rounded-lg bg-brand-primary text-white grid place-items-center shrink-0 hover:bg-brand-primary-soft transition-colors disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </form>
              <p className="text-[10px] text-ink-600 text-center mt-2 font-mono">MentorAI is powered by Llama 3.1. Verify key study plans before taking live tests.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getClientMockMentorReply(message: string): string {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes("resume") || lowercaseMsg.includes("cv") || lowercaseMsg.includes("job")) {
    return `### AI Mentor Guidance: Resume Optimization
1. **Career Guidance**: Tailor your resume to each job description. Make sure it highlights metrics (e.g., "improved load time by 30%") and features your active GitHub link.
2. **Learning Roadmap**:
   - Master the STAR (Situation, Task, Action, Result) method for behavioral questions.
   - Refactor your top 2 portfolio projects so their codebases are well-commented and organized.
   - Build a clean personal portfolio website.
3. **Recommended Skills**: Technical Writing, Markdown, Git/GitHub, Presentation Skills.`;
  }

  if (lowercaseMsg.includes("react") || lowercaseMsg.includes("web") || lowercaseMsg.includes("frontend") || lowercaseMsg.includes("html") || lowercaseMsg.includes("css")) {
    return `### AI Mentor Guidance: Frontend Web Development
1. **Career Guidance**: Focus on deep JavaScript knowledge and structural HTML before relying heavily on React frameworks. Build high-quality responsive designs.
2. **Learning Roadmap**:
   - Master modern JS (ES6+, Async/Await, Fetch API).
   - Learn React core concepts (Hooks, State Management, Custom Hooks).
   - Build an application that consumes public APIs and features dynamic layouts.
3. **Recommended Skills**: HTML5/CSS3, Modern JavaScript, React.js, Tailwind CSS, API Integration.`;
  }

  if (lowercaseMsg.includes("python") || lowercaseMsg.includes("data") || lowercaseMsg.includes("ml") || lowercaseMsg.includes("ai") || lowercaseMsg.includes("machine")) {
    return `### AI Mentor Guidance: Data Science & AI Development
1. **Career Guidance**: Industry demands candidates who can solve real business problems, not just run ".fit()" on basic tutorials. Focus on data cleaning and engineering.
2. **Learning Roadmap**:
   - Master SQL for database operations and Python libraries like Pandas/NumPy.
   - Study classical machine learning models (Regression, Trees, Clustering).
   - Develop understanding of Deep Learning frameworks (PyTorch or TensorFlow) and LLM prompt engineering.
3. **Recommended Skills**: Python, SQL, Pandas, Scikit-Learn, PyTorch, Jupyter Notebooks.`;
  }

  if (lowercaseMsg.includes("dsa") || lowercaseMsg.includes("coding") || lowercaseMsg.includes("leetcode") || lowercaseMsg.includes("algorithm")) {
    return `### AI Mentor Guidance: Coding & Technical Interviews
1. **Career Guidance**: Consistency beats cramming. Solve 1-2 problems daily and focus on pattern recognition (e.g., Two Pointers, Sliding Window, DFS/BFS) rather than memorizing solutions.
2. **Learning Roadmap**:
   - Begin with basic structures: Arrays, Strings, Linked Lists, Stacks, Queues.
   - Progress to Trees, Graphs, Heap, and Dynamic Programming.
   - Conduct mock coding interviews where you explain your thoughts out loud.
3. **Recommended Skills**: Time/Space Complexity Analysis, Recursion, Dynamic Programming, Hash Maps.`;
  }

  return `### AI Mentor Guidance: Career Development & Roadmap
1. **Career Guidance**: To maximize your career readiness, maintain a high CGPA, build practical software engineering projects, and practice communication daily.
2. **Learning Roadmap**:
   - **Fundamentals**: Master Object-Oriented Programming (OOP), Databases (SQL/NoSQL), and operating system concepts.
   - **Practicality**: Build a complete fullstack application (like this one!) and deploy it.
   - **Networking**: Share your learnings on LinkedIn or Twitter to build visibility.
3. **Recommended Skills**: Git/GitHub, Full-Stack Architecture, Database Management, Problem Solving.`;
}
