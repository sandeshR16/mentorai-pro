import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field } from "@/components/auth-shell";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — MentorAI" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthShell
      title="Reset your password."
      subtitle="We'll send you a secure reset link."
      footer={<><Link to="/auth/sign-in" className="text-brand-primary hover:underline font-medium">← Back to sign in</Link></>}
    >
      <div className="space-y-4">
        <Field label="College email" type="email" placeholder="you@college.edu" />
        <button className="w-full bg-brand-primary text-white font-semibold rounded-lg py-3 shadow-lg shadow-brand-primary/30 hover:bg-brand-primary-soft transition-all">
          Send reset link
        </button>
      </div>
    </AuthShell>
  );
}
