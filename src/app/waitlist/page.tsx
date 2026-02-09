import type { Metadata } from "next";
import { WaitlistForm } from "@/components/shared/WaitlistForm";
import { Shield, Lock, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description:
    "Be the first to know when uBelong.ai launches. Join 500+ families already on the waitlist.",
};

const benefits = [
  {
    icon: Bell,
    title: "Early Access",
    description: "Be among the first to use uBelong.ai when we launch.",
  },
  {
    icon: Shield,
    title: "Founding Member Benefits",
    description: "Exclusive discounts and features for waitlist members.",
  },
  {
    icon: Lock,
    title: "No Spam Promise",
    description: "We'll only email you about launch updates. That's it.",
  },
];

export default function WaitlistPage() {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Join the waitlist
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Be the first to know when uBelong.ai launches. We&apos;re building
              something special for Indian families managing chronic conditions.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["PS", "RM", "AK", "VG"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-medium text-white border-2 border-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <strong>500+</strong> families already waiting
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Reserve your spot
            </h2>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  );
}
