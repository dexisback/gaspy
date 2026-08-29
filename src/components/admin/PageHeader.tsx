interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        <p className="mt-1 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
