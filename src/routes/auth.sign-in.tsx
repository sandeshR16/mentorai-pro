import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, SocialButtons, Divider } from "@/components/auth-shell";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — MentorAI" }, { name: "description", content: "Log in to MentorAI." }] }),
  component: SignIn,
});

function SignIn() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Pick up your training where you left off."
      footer={<>New here? <Link to="/auth/sign-up" className="text-brand-primary hover:underline font-medium">Create an account</Link></>}
    >
      <SocialButtons />
      <Divider />
      <div className="space-y-4">
        <Field label="College email" type="email" placeholder="you@college.edu" />
        <div>
          <Field label="Password" type="password" placeholder="••••••••" />
          <Link to="/auth/forgot-password" className="text-xs text-brand-primary hover:underline mt-2 inline-block">Forgot password?</Link>
        </div>
        <Link to="/app/dashboard" className="block text-center w-full bg-brand-primary text-white font-semibold rounded-lg py-3 shadow-lg shadow-brand-primary/30 hover:bg-brand-primary-soft transition-all">
          Continue
        </Link>
      </div>
    </AuthShell>
  );
}
