"use client";

import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "light", label: "Light", hint: "Crisp neutral canvas" },
  { value: "dark", label: "Dark", hint: "Dimmed operations mode" },
] as const;

export function SettingsThemeControl() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:max-w-sm">
      {OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`rounded-lg border px-3.5 py-3 text-left transition-all duration-150 cursor-pointer ${
              active
                ? "border-accent/50 bg-accent/10"
                : "border-border/60 bg-background/50 hover:bg-muted/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  active ? "bg-accent" : "bg-muted-foreground/40"
                }`}
                aria-hidden
              />
              <span
                className={`text-[13px] ${
                  active
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground"
                }`}
              >
                {option.label}
              </span>
            </span>
            <span className="mt-1 block pl-4 text-[11px] text-muted-foreground">
              {option.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
