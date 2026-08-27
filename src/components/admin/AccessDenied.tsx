"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AccessDenied() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="app-surface relative z-10 w-full max-w-sm rounded-2xl border border-border/40 p-8 text-center">
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-[15px] font-bold text-foreground">
            Access denied
          </h1>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Your account doesn&apos;t have permission to view the admin
            dashboard. If you believe this is a mistake, contact the site
            owner.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="app-btn-3d w-full rounded-full border border-border/60 bg-card px-5 py-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
          <Link
            href="/"
            className="rounded-full px-5 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
