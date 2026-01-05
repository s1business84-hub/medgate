import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-sm text-slate-500 uppercase tracking-wide">Legal Disclaimer & Terms of Use</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Legal Disclaimer & Terms of Use</h1>
          <p className="text-slate-600 mt-2">Last Updated: December 29, 2025</p>
          <p className="text-slate-500 text-sm mt-3">This document is provided for informational purposes and does not constitute legal advice.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-10">
            {/* 1. Platform Role & Disclaimer of Affiliation */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">1. Platform Role & Disclaimer of Affiliation</h2>
              <p className="text-slate-700 leading-relaxed">
                This platform operates as an independent facilitation and application-management service for clinical observerships and electives in the United Arab Emirates.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We are not a hospital, clinic, university, or healthcare authority, and we do not provide medical training, certification, or licensure.
              </p>
              <p className="text-slate-700 leading-relaxed">We are not affiliated with, endorsed by, or acting on behalf of any hospital, clinic, university, or regulatory body, including but not limited to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Dubai Health Authority</li>
                <li>Abu Dhabi Department of Health</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">All clinical placements are subject to independent approval by the hosting institution.</p>
            </section>

            {/* 2. No Guarantee of Acceptance */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">2. No Guarantee of Acceptance</h2>
              <p className="text-slate-700 leading-relaxed">Submission of an application through this platform does not guarantee:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Acceptance into any observership or elective</li>
                <li>Placement in a specific department</li>
                <li>Approval by a hospital, clinic, or supervising physician</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Final decisions are made solely by the hosting institution, which reserves the right to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Accept or reject any applicant</li>
                <li>Modify requirements</li>
                <li>Cancel or postpone placements</li>
                <li>Withdraw approval at any stage</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">without obligation to provide justification.</p>
            </section>

            {/* 3. Accuracy of Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">3. Accuracy of Information</h2>
              <p className="text-slate-700 leading-relaxed">While we strive to keep hospital requirements and program details accurate and current:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Requirements may change without notice</li>
                <li>Hospitals may request additional documents beyond those listed</li>
                <li>Processing timelines and availability are not guaranteed</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Applicants are responsible for ensuring that all submitted information and documents are accurate, complete, and up to date.</p>
              <p className="text-slate-700 leading-relaxed">The platform is not liable for delays, rejections, losses, or missed opportunities arising from incomplete, expired, inaccurate, or institution-modified submissions.</p>
            </section>

            {/* 4. Health, Immunization & Clearance Responsibility */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">4. Health, Immunization & Clearance Responsibility</h2>
              <p className="text-slate-700 leading-relaxed">Applicants acknowledge that:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Hospitals in the UAE require strict infection-control compliance</li>
                <li>Health clearance requirements are mandatory for hospital access</li>
                <li>Final validation of health documents rests with the hosting institution</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">The platform does not provide medical verification, diagnosis, or certification and does not assume responsibility for hospital rejections due to health-related documentation.</p>
            </section>

            {/* 5. Observership & Elective Scope */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">5. Observership & Elective Scope</h2>
              <p className="text-slate-700 leading-relaxed">Applicants acknowledge that:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Observerships are observational only</li>
                <li>No hands on patient care, procedures, or clinical decision making is permitted unless explicitly authorized by the host institution</li>
                <li>The platform does not authorize clinical activity</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Any clinical permissions granted are solely at the discretion of the hosting institution and may be revoked at any time.</p>
              <p className="text-slate-700 leading-relaxed">Any breach of hospital policies, confidentiality rules, or professional conduct standards may result in immediate termination of the placement.</p>
            </section>

            {/* 6. Data Protection & Privacy */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">6. Data Protection & Privacy</h2>
              <h3 className="text-base font-semibold text-slate-900">Data Handling</h3>
              <p className="text-slate-700 leading-relaxed">By using this platform, applicants consent to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Uploading personal, academic, and health-related documents</li>
                <li>Secure storage and controlled access for application processing</li>
                <li>Sharing documents only with relevant hospitals or institutions for application review</li>
              </ul>
              <h3 className="text-base font-semibold text-slate-900">Security</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Access to documents is role-restricted</li>
                <li>Documents are not publicly visible</li>
                <li>Data is not sold or shared for marketing purposes</li>
                <li>Data is processed in accordance with applicable UAE data protection regulations</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Despite reasonable security measures, no online platform can guarantee absolute security. Users acknowledge and accept this risk.</p>
            </section>

            {/* 7. Limitation of Liability */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">7. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">To the fullest extent permitted by law, the platform shall not be liable for:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Application rejections</li>
                <li>Visa issues</li>
                <li>Missed academic or career opportunities</li>
                <li>Financial losses</li>
                <li>Hospital policy changes</li>
                <li>Cancellations or scheduling conflicts</li>
                <li>Actions or decisions taken by hospitals or regulators</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Use of this platform is entirely at the user&apos;s own risk and discretion.</p>
            </section>

            {/* 8. User Obligations */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">8. User Obligations</h2>
              <p className="text-slate-700 leading-relaxed">By using the platform, users agree to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Provide truthful and accurate information</li>
                <li>Upload authentic, unaltered documents</li>
                <li>Respect hospital policies and UAE laws</li>
                <li>Maintain professional conduct at all times</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Submission of falsified or misleading documents may result in:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Immediate account termination</li>
                <li>Application cancellation</li>
                <li>Reporting to the hosting institution</li>
              </ul>
            </section>

            {/* 9. Fees & Payments (If Applicable) */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">9. Fees & Payments (If Applicable)</h2>
              <p className="text-slate-700 leading-relaxed">Any platform fees (where applicable):</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Cover administrative and facilitation services only and do not constitute hospital or clinical fees</li>
                <li>Do not guarantee placement</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">Refund policies, if applicable, are governed by separate payment terms.</p>
            </section>

            {/* 10. Governing Law & Jurisdiction */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">10. Governing Law & Jurisdiction</h2>
              <p className="text-slate-700 leading-relaxed">These Terms are governed by the laws of the United Arab Emirates.</p>
              <p className="text-slate-700 leading-relaxed">Any disputes arising from use of this platform shall fall under the exclusive jurisdiction of UAE courts.</p>
            </section>

            {/* 11. Acceptance of Terms */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">11. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By creating an account, submitting an application, or otherwise using this platform, users confirm that they have read, understood, and agreed to be legally bound by these Terms & Disclaimers in full.
              </p>
            </section>
          </div>
          <div className="px-6 sm:px-8 py-4 bg-slate-100 border-t border-slate-200 text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Use of this platform constitutes acceptance of these terms.</span>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
