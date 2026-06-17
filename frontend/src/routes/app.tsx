import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect } from "react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      navigate({ to: "/auth/sign-in" });
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(30,27,75,0.35),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_45%)]">
        <Outlet />
      </main>
    </div>
  );
}
