import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-guard";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session?.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 z-0 -translate-x-1/2 opacity-25 dark:opacity-20">
        <div
          className="rounded-full blur-[140px]"
          style={{
            width: "600px",
            height: "250px",
            background: "rgba(197, 248, 10, 0.14)",
          }}
        />
      </div>

      <div className="app-surface relative z-10 w-full max-w-sm rounded-2xl border border-border/40 p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-[15px] font-bold text-foreground">
            Admin Access
          </h1>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Sign in with an account that has admin permissions to manage
            documents, Q&A pairs, and analytics.
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
