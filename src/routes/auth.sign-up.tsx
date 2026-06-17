import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, SocialButtons, Divider } from "@/components/auth-shell";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({ meta: [{ title: "Sign up — MentorAI" }, { name: "description", content: "Create your MentorAI account." }] }),
  component: SignUp,
});

function SignUp() {
  return (
    <AuthShell
      title="Start your engine."
      subtitle="Free for students. No credit card required."
      footer={<>Already have an account? <Link to="/auth/sign-in" className="text-brand-primary hover:underline font-medium">Sign in</Link></>}
    >
      <SocialButtons />
      <Divider />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" placeholder="Sarah" />
          <Field label="Last name" placeholder="Chen" />
        </div>
        <Field label="College email" type="email" placeholder="you@college.edu" />
        <Field label="Password" type="password" placeholder="At least 8 characters" />
        <label className="flex items-start gap-2 text-xs text-ink-400">
          <input type="checkbox" className="mt-0.5 accent-brand-primary" />
          <span>I agree to the <a href="#" className="text-brand-primary hover:underline">Terms</a> and <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a>.</span>
        </label>
        <Link to="/app/dashboard" className="block text-center w-full bg-brand-primary text-white font-semibold rounded-lg py-3 shadow-lg shadow-brand-primary/30 hover:bg-brand-primary-soft transition-all">
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}
