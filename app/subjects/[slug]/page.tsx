import { notFound } from "next/navigation";
import SubjectShell from "@/components/ComponentShell";
import { SUBJECTS, SUBJECTS_BY_SLUG } from "@/content";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ slug: s.slug }));
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = SUBJECTS_BY_SLUG[slug];
  if (!subject) notFound();
  return <SubjectShell subject={subject} />;
}