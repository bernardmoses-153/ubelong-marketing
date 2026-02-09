import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How uBelong.ai collects, uses, and protects your personal and health information.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: February 2026</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-4">
              uBelong.ai (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy
              and the security of your personal and health information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when
              you use our mobile application and website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Account credentials</li>
              <li>Profile information (age, gender, location)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Health Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Blood glucose readings and other vital signs</li>
              <li>Medication schedules and adherence data</li>
              <li>Food and activity logs</li>
              <li>Health conditions and medical history you choose to share</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Device information and identifiers</li>
              <li>App usage patterns and preferences</li>
              <li>Log data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide and personalize our health tracking services</li>
              <li>Generate your Drift Score and health insights</li>
              <li>Power AI coaching recommendations</li>
              <li>Enable Care Circle features and family sharing</li>
              <li>Send medication reminders and health alerts</li>
              <li>Improve our services and develop new features</li>
              <li>Communicate with you about your account and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">HIPAA Compliance</h2>
            <p className="text-gray-600 mb-4">
              uBelong.ai is designed to be compliant with the Health Insurance Portability
              and Accountability Act (HIPAA). We implement administrative, physical, and
              technical safeguards to protect your Protected Health Information (PHI).
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>256-bit AES encryption for data at rest and in transit</li>
              <li>Strict access controls and authentication</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee training on HIPAA requirements</li>
              <li>Business Associate Agreements with all third-party vendors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal or health information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>With Care Circle members you explicitly authorize</li>
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our legal rights</li>
              <li>In connection with a merger or acquisition (with notice)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Retention</h2>
            <p className="text-gray-600 mb-4">
              Your data is stored in secure data centers located in India, ensuring
              compliance with local data residency requirements. We retain your
              information for as long as your account is active or as needed to
              provide services. You may request deletion of your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access and download your health data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request information about data sharing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> privacy@ubelong.ai<br />
              <strong>Address:</strong> Bangalore, Karnataka, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
