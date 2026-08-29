import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { getSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { PanelSurface } from "@/components/admin/PanelSurface";
import { SettingsThemeControl } from "@/components/admin/SettingsThemeControl";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [docs, qaPairs, chunks] = await Promise.all([
    withDbRetry(() => prisma.document.count()),
    withDbRetry(() => prisma.qAPair.count()),
    withDbRetry(() => prisma.chunk.count()),
  ]);

  const user = session.user;

  const workspaceRows: Array<[string, string]> = [
    ["Knowledge sources", `${docs} indexed`],
    ["Retrieval chunks", `${chunks} embedded`],
    ["Q&A pairs", `${qaPairs} configured`],
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 md:px-8">
      <PageHeader
        title="Settings"
        description="Workspace preferences and account details."
      />

      <div className="flex flex-col gap-4">
        <PanelSurface className="p-5">
          <h3 className="mb-4 text-[13.5px] font-semibold text-foreground">
            Profile
          </h3>
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[15px] font-bold text-[#5d7a02] dark:text-[#C5F80A]">
              {(user.name?.[0] ?? user.email?.[0] ?? "A").toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-[12.5px] text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <p className="mt-4 border-t border-border/40 pt-3 text-[11.5px] text-muted-foreground">
            Profile details are managed by your Google account.
          </p>
        </PanelSurface>

        <PanelSurface className="p-5">
          <h3 className="mb-1 text-[13.5px] font-semibold text-foreground">
            Appearance
          </h3>
          <p className="mb-4 text-[12px] text-muted-foreground">
            Choose how Gaspy looks across the app. Defaults to light.
          </p>
          <SettingsThemeControl />
        </PanelSurface>

        <PanelSurface className="p-5">
          <h3 className="mb-1 text-[13.5px] font-semibold text-foreground">
            Workspace
          </h3>
          <p className="mb-4 text-[12px] text-muted-foreground">
            Live values from your Gaspy workspace.
          </p>
          <dl className="divide-y divide-border/40">
            {workspaceRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 text-[13px]"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium text-foreground font-tabular">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </PanelSurface>

        <p className="px-1 text-[11.5px] text-muted-foreground/80">
          More preferences are on the way.
        </p>
      </div>
    </div>
  );
}
