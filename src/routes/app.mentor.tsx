import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { useState } from "react";
import { Sparkles, Send, Paperclip, FileText, Map, MessageSquare, History } from "lucide-react";
import { mentorPrompts } from "@/lib/mock-data";

export const Route = createFileRoute("/app/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — MentorAI" }] }),
  component: Mentor,
});

type Msg = { role: "ai" | "me"; text: string };

function Mentor() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi Sarah — I've reviewed your latest commits and your last Google L4 mock. Strong on React, but your system design responses are missing capacity estimation. Want to drill that today?" },
    { role: "me", text: "Yes. Let's start with how to estimate QPS for a global notification service." },
    { role: "ai", text: "Good. Start with the user base: assume 500M MAU, 30% DAU → 150M DAU. Average 10 notifications/day → 1.5B/day → ~17k QPS average, with peaks at 5–10x. Now — how do you partition the write path to absorb the peak?" },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "me", text }, { role: "ai", text: "Excellent question. Let me draft a roadmap for you — give me 30 seconds while I check your skill profile..." }]);
    setInput("");
  };

  return (
    <>
      <AppTopbar title="AI Mentor" subtitle="Mentor-GPT 4.0 · Fine-tuned on 50k+ interview transcripts" badge="Online" />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* History sidebar */}
        <aside className="hidden xl:flex w-72 shrink-0 border-r border-border flex-col p-4">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold shadow-lg shadow-brand-primary/20 mb-4">
            <Sparkles className="size-4" /> New conversation
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 px-2 mb-2 flex items-center gap-2"><History className="size-3" /> History</p>
          <div className="space-y-1 overflow-y-auto">
            {["System design for Google L4", "Resume review — backend roles", "DSA: dynamic programming", "Behavioral: conflict story", "Why Stripe over Square?"].map((t, i) => (
              <button key={i} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${i === 0 ? "bg-white/5 text-white" : "text-ink-400 hover:text-white hover:bg-white/5"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-border space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-ink-300 hover:bg-white/5 transition-colors">
              <FileText className="size-3.5" /> Generate roadmap
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-ink-300 hover:bg-white/5 transition-colors">
              <Map className="size-3.5" /> Resume guidance
            </button>
          </div>
        </aside>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 animate-fade-up ${m.role === "me" ? "flex-row-reverse" : ""}`}>
                  <div className={`size-9 rounded-lg shrink-0 grid place-items-center text-xs font-bold ${m.role === "ai" ? "bg-gradient-to-br from-brand-primary to-brand-secondary text-white" : "bg-white/5 text-ink-300 border border-border"}`}>
                    {m.role === "ai" ? <Sparkles className="size-4" /> : "SC"}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${m.role === "ai" ? "glass-card text-ink-200 rounded-tl-none" : "bg-brand-primary text-white rounded-tr-none"}`}>
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {messages.length <= 3 && (
            <div className="max-w-3xl mx-auto w-full px-6 lg:px-8 pb-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-2 flex items-center gap-2"><MessageSquare className="size-3" /> Try asking</p>
              <div className="flex flex-wrap gap-2">
                {mentorPrompts.map((p) => (
                  <button key={p} onClick={() => send(p)} className="text-xs glass-card rounded-full px-3 py-1.5 text-ink-300 hover:text-white hover:border-brand-primary/30 transition-all">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-4 bg-background/50 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-2 flex items-end gap-2">
                <button className="size-9 rounded-lg text-ink-400 hover:text-white hover:bg-white/5 grid place-items-center shrink-0">
                  <Paperclip className="size-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder="Ask anything — career advice, mock me, debug my code..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-white placeholder:text-ink-500 py-2"
                />
                <button onClick={() => send(input)} className="size-9 rounded-lg bg-brand-primary text-white grid place-items-center shrink-0 hover:bg-brand-primary-soft transition-colors">
                  <Send className="size-4" />
                </button>
              </div>
              <p className="text-[10px] text-ink-600 text-center mt-2 font-mono">MentorAI may make mistakes. Verify before relying on advice for live interviews.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
