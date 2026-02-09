import type { Metadata } from "next";
import { Features } from "@/components/sections/Features";
import { DriftScoreShowcase } from "@/components/sections/DriftScoreShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover how uBelong.ai helps families manage chronic conditions with AI coaching, Care Circles, and the innovative Drift Score.",
};

export default function FeaturesPage() {
  return (
    <div className="pt-16">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Features built for families
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage chronic conditions, coordinate care,
            and keep your family healthy together.
          </p>
        </div>
      </section>

      <Features />
      <DriftScoreShowcase />
      <HowItWorks />
      <CTA />
    </div>
  );
}
