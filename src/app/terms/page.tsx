import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using uBelong.ai services.",
};

export default function TermsPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: February 2026</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using uBelong.ai (&quot;Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do
              not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-600 mb-4">
              uBelong.ai is a family health management platform that provides:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Health tracking and monitoring tools</li>
              <li>AI-powered health coaching</li>
              <li>Family care coordination features (Care Circles)</li>
              <li>Medication tracking and reminders</li>
              <li>Health insights and analytics (Drift Score)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Medical Disclaimer</h2>
            <p className="text-gray-600 mb-4 font-semibold">
              IMPORTANT: uBelong.ai is not a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Always consult qualified healthcare providers for medical decisions</li>
              <li>Never disregard professional medical advice based on app content</li>
              <li>In case of emergency, contact emergency services immediately</li>
              <li>Our AI coach provides general wellness guidance, not medical prescriptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activity under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Care Circles</h2>
            <p className="text-gray-600 mb-4">
              Care Circles enable family members to share health information. By using this feature:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>You consent to sharing specified data with Circle members</li>
              <li>You agree to respect the privacy of other Circle members</li>
              <li>You understand that you control what information is shared</li>
              <li>You can leave a Care Circle or revoke sharing at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Share false or misleading health information</li>
              <li>Attempt to access other users&apos; accounts without authorization</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse engineer or copy the Service</li>
              <li>Use automated systems to access the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Subscription and Payments</h2>
            <p className="text-gray-600 mb-4">
              Some features require a paid subscription. For paid plans:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Prices are displayed in Indian Rupees (INR)</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>You may cancel at any time through the app</li>
              <li>Refunds are provided per our refund policy</li>
              <li>We may change prices with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its content, including but not limited to text, graphics,
              logos, and software, are the property of uBelong.ai and protected by
              intellectual property laws. You may not copy, modify, or distribute our
              content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, uBelong.ai shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages,
              including loss of data or health complications arising from reliance on
              the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account at any time for violation of
              these Terms. You may delete your account at any time through the app
              settings. Upon termination, your right to use the Service ceases
              immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may update these Terms from time to time. We will notify you of material
              changes via email or app notification. Continued use after changes
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms are governed by the laws of India. Any disputes shall be
              resolved in the courts of Bangalore, Karnataka.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> legal@ubelong.ai<br />
              <strong>Address:</strong> Bangalore, Karnataka, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
