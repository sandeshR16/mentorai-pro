import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export const Route = createFileRoute("/auth/social-login")({
  head: () => ({ meta: [{ title: "Authorize Application" }] }),
  component: SocialLogin,
});

function SocialLogin() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState("Google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1); // For Google's 2-step login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prov = params.get("provider") || "Google";
    // Normalize casing
    const capitalized = prov.charAt(0).toUpperCase() + prov.slice(1).toLowerCase();
    setProvider(capitalized);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // For Google, step 1 is email, step 2 is password
    if (provider === "Google" && step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Try backend register/login first
      const res = await api.post("/auth/login", {
        email,
        password: `social_${provider.toLowerCase()}_password`
      });

      // Calculate dynamic name based on email prefix if not supplied
      let finalName = name;
      if (!finalName) {
        const emailPrefix = email.split("@")[0];
        finalName = emailPrefix
          .split(/[._-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Store credentials
      localStorage.setItem("token", res.data.token);
      
      const userObj = {
        ...res.data.user,
        name: finalName || res.data.user.name || "Mock Student",
        email: email
      };
      localStorage.setItem("user", JSON.stringify(userObj));

      // Redirect back
      navigate({ to: "/app/dashboard" });
    } catch (err: any) {
      console.warn("Offline fallback login via social OAuth");
      
      // Calculate dynamic name based on email prefix if not supplied
      let finalName = name;
      if (!finalName) {
        const emailPrefix = email.split("@")[0];
        finalName = emailPrefix
          .split(/[._-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      const mockUser = {
        _id: `mock_user_${provider.toLowerCase()}_${Date.now()}`,
        name: finalName || `Demo ${provider} User`,
        email: email,
        branch: "Computer Science & Engineering",
        semester: 6,
        readinessScore: 82
      };
      localStorage.setItem("token", `mock_jwt_token_${provider.toLowerCase()}`);
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate({ to: "/app/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Theme (Light, minimalist Google Card style)
  if (provider === "Google") {
    return (
      <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] flex flex-col items-center justify-center font-sans p-4">
        <div className="w-full max-w-[450px] bg-white rounded-3xl p-10 border border-[#dadce0] shadow-[0_4px_8px_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center mb-8">
            {/* Google Multi-color Logo */}
            <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">
              {step === 1 ? "Sign in" : "Welcome"}
            </h1>
            <p className="text-sm text-[#444746] mt-2">
              to continue to <span className="font-semibold text-brand-primary">MentorAI</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or phone"
                    className="w-full bg-white border border-[#747775] text-[#1f1f1f] rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name (optional)"
                    className="w-full bg-white border border-[#c4c7c5] text-[#1f1f1f] rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-all"
                  />
                </div>
                <div className="text-xs text-[#0b57d0] font-semibold hover:underline cursor-pointer">
                  Forgot email?
                </div>
                <div className="text-xs text-[#5f6368] leading-relaxed pt-2">
                  Not your computer? Use Guest mode to sign in privately.{" "}
                  <span className="text-[#0b57d0] font-semibold hover:underline cursor-pointer">
                    Learn more about using Guest mode
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f9] rounded-full text-xs font-semibold text-[#444746] w-fit border border-[#dadce0]">
                  <div className="size-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
                  {email}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white border border-[#747775] text-[#1f1f1f] rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-all"
                  />
                </div>
                <div className="text-xs text-[#0b57d0] font-semibold hover:underline cursor-pointer">
                  Forgot password?
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  if (step === 2) setStep(1);
                  else window.history.back();
                }}
                className="text-sm font-semibold text-[#0b57d0] hover:bg-[#0b57d0]/5 px-4 py-2.5 rounded-full transition-all"
              >
                {step === 2 ? "Back" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow transition-all"
              >
                {loading ? "Signing in..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // GitHub Sign-In Theme (Dark mode, GitHub card style)
  if (provider === "Github" || provider === "GitHub") {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col items-center justify-center font-sans p-4">
        <div className="w-full max-w-[340px] flex flex-col items-center mb-6">
          {/* GitHub Logo */}
          <svg className="w-12 h-12 text-[#f0f6fc] fill-current" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <h1 className="text-2xl font-light text-[#f0f6fc] tracking-tight mt-6">
            Sign in to GitHub
          </h1>
        </div>

        <div className="w-full max-w-[340px] bg-[#161b22] border border-[#30363d] rounded-md p-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#c9d1d9] block">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#c9d1d9] block">Full name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#c9d1d9]">Password</label>
                <span className="text-xs text-[#58a6ff] hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 border border-[#30363d] hover:bg-white/5 text-[#c9d1d9] font-medium text-xs py-2 rounded-md transition-all text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium text-xs py-2 rounded-md transition-all text-center"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full max-w-[340px] border border-[#30363d] rounded-md p-4 mt-4 text-center text-xs">
          New to GitHub? <span className="text-[#58a6ff] hover:underline cursor-pointer">Create an account</span>.
        </div>
      </div>
    );
  }

  // LinkedIn Sign-In Theme (Light, blue accents, LinkedIn card style)
  if (provider === "Linkedin" || provider === "LinkedIn") {
    return (
      <div className="min-h-screen bg-[#f3f2f0] text-[#000000e6] flex flex-col justify-between font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[400px] bg-white rounded-lg shadow-md p-8">
            <div className="mb-6 flex flex-col">
              {/* LinkedIn Logo */}
              <svg className="w-24 h-6 text-[#0a66c2] fill-current self-start" viewBox="0 0 84 21">
                <path d="M12.5 16h3V6h-3v10zm1.5-11.5c1 0 1.8-.8 1.8-1.8S15 1 14 1s-1.8.8-1.8 1.8.8 1.7 1.8 1.7zM20 16h3v-5.5c0-3-1.2-4.5-3.5-4.5-1.8 0-2.8 1-3.3 1.8V6h-3v10h3v-5.2c0-1.4.3-2.8 2-2.8s1.8 1.4 1.8 2.8V16zM2 16h3V1h-3v15zm1.5-16C4.9 0 6 .9 6 2s-1.1 2-2.5 2S1 3.1 1 2 2.1 0 3.5 0zM79.5 6v10h-3v-.8c-.5.8-1.5 1.8-3.3 1.8-2.3 0-3.5-1.5-3.5-4.5V6h3v5.2c0 1.4.3 2.8 2 2.8s1.8-1.4 1.8-2.8V6h3zm-13.8 5c0 2.2.8 3.5 2.5 3.5.8 0 1.6-.4 2-.9V8.4c-.4-.5-1.2-.9-2-.9-1.7 0-2.5 1.3-2.5 3.5zm7.5 5h-3v-1c-.5.7-1.5 1.5-3.1 1.5-3.3 0-4.4-2.5-4.4-5s1.1-5 4.4-5c1.6 0 2.6.8 3.1 1.5V1h3v15z" />
              </svg>
              <h1 className="text-2xl font-semibold mt-4">Sign in</h1>
              <p className="text-xs text-[#00000099] mt-1">Stay updated on your professional world</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email or Phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#00000099] hover:border-black rounded px-3 py-3 text-base text-black placeholder:text-[#00000099] focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#00000099] hover:border-black rounded px-3 py-3 text-base text-black placeholder:text-[#00000099] focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#00000099] hover:border-black rounded px-3 py-3 text-base text-black placeholder:text-[#00000099] focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 border border-[#00000099] hover:bg-black/5 text-[#00000099] font-semibold text-base py-3 rounded-full transition-all text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-50 text-white font-semibold text-base py-3 rounded-full transition-all text-center cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center py-4 text-xs text-[#00000099]">
          LinkedIn Corporation © 2024
        </div>
      </div>
    );
  }

  // Fallback Page
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center">
      <p>Loading {provider} auth provider...</p>
    </div>
  );
}
