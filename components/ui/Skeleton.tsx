import React from "react";

export function Skeleton({ className }: { className: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
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
