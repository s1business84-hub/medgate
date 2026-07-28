import Link from "next/link"
import { LiquidParallax } from "@/components/ui/liquid-parallax"

/**
 * Stable anchor ids so the footer can deep-link to the sections people
 * actually look for. Named slugs for those two; a numeric fallback for the
 * rest, so ids stay valid if section titles are reworded.
 */
function sectionAnchor(title: string): string {
  if (title.includes("Data Protection")) return "privacy"
  if (title.includes("Acceptance of Terms")) return "terms"
  const num = title.match(/^(\d+)\./)?.[1]
  return num ? `section-${num}` : "section"
}

const sections = [
  {
    title: "1. Platform Role & Disclaimer of Affiliation",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">
          This platform operates as an independent facilitation and application-management service for clinical observerships and electives in the United Arab Emirates.
        </p>
        <p className="text-slate-200/90 leading-relaxed">
          We are not a hospital, clinic, university, or healthcare authority, and we do not provide medical training, certification, or licensure.
        </p>
        <p className="text-slate-200/90 leading-relaxed">We are not affiliated with, endorsed by, or acting on behalf of any hospital, clinic, university, or regulatory body, including but not limited to:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Dubai Health Authority</li>
          <li>Abu Dhabi Department of Health</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">All clinical placements are subject to independent approval by the hosting institution.</p>
      </>
    ),
  },
  {
    title: "2. No Guarantee of Acceptance",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">Submission of an application through this platform does not guarantee:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Acceptance into any observership or elective</li>
          <li>Placement in a specific department</li>
          <li>Approval by a hospital, clinic, or supervising physician</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Final decisions are made solely by the hosting institution, which reserves the right to:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Accept or reject any applicant</li>
          <li>Modify requirements</li>
          <li>Cancel or postpone placements</li>
          <li>Withdraw approval at any stage</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">without obligation to provide justification.</p>
      </>
    ),
  },
  {
    title: "3. Accuracy of Information",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">While we strive to keep hospital requirements and program details accurate and current:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Requirements may change without notice</li>
          <li>Hospitals may request additional documents beyond those listed</li>
          <li>Processing timelines and availability are not guaranteed</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Applicants are responsible for ensuring that all submitted information and documents are accurate, complete, and up to date.</p>
        <p className="text-slate-200/90 leading-relaxed">The platform is not liable for delays, rejections, losses, or missed opportunities arising from incomplete, expired, inaccurate, or institution-modified submissions.</p>
      </>
    ),
  },
  {
    title: "4. Health, Immunization & Clearance Responsibility",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">Applicants acknowledge that:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Hospitals in the UAE require strict infection-control compliance</li>
          <li>Health clearance requirements are mandatory for hospital access</li>
          <li>Final validation of health documents rests with the hosting institution</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">The platform does not provide medical verification, diagnosis, or certification and does not assume responsibility for hospital rejections due to health-related documentation.</p>
      </>
    ),
  },
  {
    title: "5. Observership & Elective Scope",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">Applicants acknowledge that:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Observerships are observational only</li>
          <li>No hands on patient care, procedures, or clinical decision making is permitted unless explicitly authorized by the host institution</li>
          <li>The platform does not authorize clinical activity</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Any clinical permissions granted are solely at the discretion of the hosting institution and may be revoked at any time.</p>
        <p className="text-slate-200/90 leading-relaxed">Any breach of hospital policies, confidentiality rules, or professional conduct standards may result in immediate termination of the placement.</p>
      </>
    ),
  },
  {
    title: "6. Data Protection & Privacy",
    body: (
      <>
        <h3 className="text-base font-semibold text-blue-100">Data Handling</h3>
        <p className="text-slate-200/90 leading-relaxed">By using this platform, applicants consent to:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Uploading personal, academic, and health-related documents</li>
          <li>Secure storage and controlled access for application processing</li>
          <li>Sharing documents only with relevant hospitals or institutions for application review</li>
        </ul>
        <h3 className="text-base font-semibold text-blue-100">Security</h3>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Access to documents is role-restricted</li>
          <li>Documents are not publicly visible</li>
          <li>Data is not sold or shared for marketing purposes</li>
          <li>Data is processed in accordance with applicable UAE data protection regulations</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Despite reasonable security measures, no online platform can guarantee absolute security. Users acknowledge and accept this risk.</p>
      </>
    ),
  },
  {
    title: "7. Limitation of Liability",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">To the fullest extent permitted by law, the platform shall not be liable for:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Application rejections</li>
          <li>Visa issues</li>
          <li>Missed academic or career opportunities</li>
          <li>Financial losses</li>
          <li>Hospital policy changes</li>
          <li>Cancellations or scheduling conflicts</li>
          <li>Actions or decisions taken by hospitals or regulators</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Use of this platform is entirely at the user&apos;s own risk and discretion.</p>
      </>
    ),
  },
  {
    title: "8. User Obligations",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">By using the platform, users agree to:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Provide truthful and accurate information</li>
          <li>Upload authentic, unaltered documents</li>
          <li>Respect hospital policies and UAE laws</li>
          <li>Maintain professional conduct at all times</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Submission of falsified or misleading documents may result in:</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Immediate account termination</li>
          <li>Application cancellation</li>
          <li>Reporting to the hosting institution</li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Fees & Payments (If Applicable)",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">Any platform fees (where applicable):</p>
        <ul className="list-disc pl-5 text-slate-200/90 space-y-1">
          <li>Cover administrative and facilitation services only and do not constitute hospital or clinical fees</li>
          <li>Do not guarantee placement</li>
        </ul>
        <p className="text-slate-200/90 leading-relaxed">Refund policies, if applicable, are governed by separate payment terms.</p>
      </>
    ),
  },
  {
    title: "10. Governing Law & Jurisdiction",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">These Terms are governed by the laws of the United Arab Emirates.</p>
        <p className="text-slate-200/90 leading-relaxed">Any disputes arising from use of this platform shall fall under the exclusive jurisdiction of UAE courts.</p>
      </>
    ),
  },
  {
    title: "11. Acceptance of Terms",
    body: (
      <>
        <p className="text-slate-200/90 leading-relaxed">
          By creating an account, submitting an application, or otherwise using this platform, users confirm that they have read, understood, and agreed to be legally bound by these Terms & Disclaimers in full.
        </p>
      </>
    ),
  },
]

export default function LegalPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/60 to-black/80" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        <header className="text-center space-y-3 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-300/30 bg-blue-500/10 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-300 via-blue-200 to-indigo-200">Legal Disclaimer & Terms of Use</h1>
          <p className="text-slate-300">Last Updated: January 8, 2026</p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">This document is provided for informational purposes and does not constitute legal advice.</p>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="relative p-6 sm:p-10 space-y-8">
            {sections.map((section, idx) => (
              <section
                key={section.title}
                id={sectionAnchor(section.title)}
                className="scroll-mt-24 space-y-3 border border-white/5 rounded-2xl bg-white/5 p-5 sm:p-6 shadow-inner"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-50 drop-shadow-[0_0_12px_rgba(14,165,233,0.25)]">{section.title}</h2>
                  <span className="text-xs text-slate-400">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="space-y-3 text-sm sm:text-base leading-relaxed">{section.body}</div>
              </section>
            ))}
          </div>
          <div className="relative px-6 sm:px-10 py-5 border-t border-white/10 bg-white/5 text-sm text-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Use of this platform constitutes acceptance of these terms.</span>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-slate-100 font-semibold hover:bg-white/20 transition-colors">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
