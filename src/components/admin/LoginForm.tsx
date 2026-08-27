"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin",
      });
      if (res?.error) {
        setError(
          res.error.message ||
            "Sign-in failed. Make sure Google OAuth is configured."
        );
        setLoading(false);
      }
      // On success Better Auth redirects to the callback URL.
    } catch {
      setError("Sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="app-btn-3d flex w-full items-center justify-center gap-2.5 rounded-full border border-border/60 bg-card px-5 py-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

      {error && (
        <p className="text-[12px] leading-relaxed text-red-500">{error}</p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
