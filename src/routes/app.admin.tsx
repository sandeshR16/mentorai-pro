import { createFileRoute } from "@tanstack/react-router";
import { AppTopbar } from "@/components/app-topbar";
import { collegeMetrics, placementTrend } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Users, GraduationCap, Building2, ArrowUpRight, Download } from "lucide-react";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — MentorAI" }] }),
  component: Admin,
});

const sectorData = [
  { name: "Product (FAANG)", value: 38, color: "#6366f1" },
  { name: "Startups (Unicorn)", value: 24, color: "#06b6d4" },
  { name: "Enterprise SaaS", value: 21, color: "#10b981" },
  { name: "Fintech", value: 11, color: "#f59e0b" },
  { name: "Other", value: 6, color: "#64748b" },
];

function Admin() {
  return (
    <>
      <AppTopbar title="Admin · Institutional Analytics" subtitle="24 partner colleges · 5,300 active students" badge="Admin" />
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {["This week", "MTD", "QTD", "YTD"].map((t, i) => (
              <button key={t} className={`px-3 py-1.5 rounded-md text-xs font-medium ${i === 3 ? "bg-brand-primary text-white" : "glass-card text-ink-300 hover:text-white"}`}>{t}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm text-ink-200 hover:text-white">
            <Download className="size-3.5" /> Export report
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Active Students", v: "5,302", d: "+312 this month", icon: Users, c: "primary" },
            { l: "Verified Offers", v: "1,420", d: "+184 this quarter", icon: GraduationCap, c: "accent" },
            { l: "Placement Rate", v: "92%", d: "+6 pts YoY", icon: TrendingUp, c: "secondary" },
            { l: "Partner Companies", v: "186", d: "+24 this year", icon: Building2, c: "amber" },
          ].map((k) => {
            const Icon = k.icon;
            const cm: Record<string, string> = {
              primary: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
              secondary: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20",
              accent: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
              amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
            };
            return (
              <div key={k.l} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`size-9 rounded-lg border grid place-items-center ${cm[k.c]}`}>
                    <Icon className="size-4" strokeWidth={2.2} />
                  </div>
                  <ArrowUpRight className="size-3.5 text-ink-500" />
                </div>
                <p className="text-xs text-ink-500">{k.l}</p>
                <p className="font-display text-2xl font-bold text-white mt-1">{k.v}</p>
                <p className="text-[10px] text-brand-accent mt-1 font-mono">{k.d}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-1">Placement trend</h3>
            <p className="text-xs text-ink-500 mb-4">Rolling 6-month view · all partner colleges</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={placementTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="offerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="offers" stroke="#6366f1" strokeWidth={2} fill="url(#offerGrad)" />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#rateGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-1">Offer distribution by sector</h3>
            <p className="text-xs text-ink-500 mb-4">Q4 2024</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {sectorData.map((s) => <Cell key={s.name} fill={s.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {sectorData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-ink-400">
                    <span className="size-2 rounded-full" style={{ background: s.color }} /> {s.name}
                  </span>
                  <span className="font-mono text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-white">College performance</h3>
              <p className="text-xs text-ink-500">All partner institutions · current cohort</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-ink-500 border-b border-border">
                  <th className="px-6 py-3">College</th>
                  <th className="px-6 py-3">Students</th>
                  <th className="px-6 py-3">Placed</th>
                  <th className="px-6 py-3">Rate</th>
                  <th className="px-6 py-3">Avg CTC</th>
                  <th className="px-6 py-3 w-48">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {collegeMetrics.map((c) => (
                  <tr key={c.name} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-ink-300 font-mono">{c.students.toLocaleString()}</td>
                    <td className="px-6 py-4 text-ink-300 font-mono">{c.placed.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        c.rate >= 90 ? "bg-brand-accent/10 text-brand-accent" :
                        c.rate >= 85 ? "bg-brand-primary/10 text-brand-primary" :
                        "bg-amber-400/10 text-amber-400"
                      }`}>{c.rate}%</span>
                    </td>
                    <td className="px-6 py-4 text-white font-mono">₹{c.avgCTC} LPA</td>
                    <td className="px-6 py-4">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${c.rate}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
