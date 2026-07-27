import { cn } from "@/lib/utils"

/**
 * Base skeleton — shadcn/ui shape, required by the reUI data-grid.
 * The composed skeletons below are this project's own and were restored
 * after the registry install overwrote this file.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export function ProgramsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export { Skeleton }
