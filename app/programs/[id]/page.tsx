import { programs, hospitals } from "@/lib/mockData";
import { notFound } from "next/navigation";
import { ProgramDetailClient } from "./page.client";

interface ProgramDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;
  const program = programs.find((p) => p.id === id);
  const hospital = program ? hospitals.find((h) => h.id === program.hospitalId) : null;

  if (!program || !hospital) {
    notFound();
  }

  const relatedPrograms = programs.filter((p) => p.id !== program.id && p.hospitalId === hospital.id).slice(0, 2);

  return <ProgramDetailClient program={program} hospital={hospital} relatedPrograms={relatedPrograms} />;
}
