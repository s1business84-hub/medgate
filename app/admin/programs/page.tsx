import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Inner from "./inner";

export default function Page() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>
      </div>
      <Inner />
    </div>
  );
}
