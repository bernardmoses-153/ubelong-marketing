"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DriftRing } from "@/components/shared/DriftRing";
import { Button } from "@/components/ui/button";
import { getDriftLabel } from "@/lib/utils";

const driftExamples = [
  {
    score: 92,
    title: "On Track",
    description: "All medications taken, healthy meals logged, and daily movement goals met.",
  },
  {
    score: 68,
    title: "Mild Drift",
    description: "Missed one medication. AI coach suggests setting a reminder for next time.",
  },
  {
    score: 42,
    title: "Moderate Drift",
    description: "Several missed logs this week. Care Circle gets notified to check in.",
  },
  {
    score: 23,
    title: "Needs Attention",
    description: "Significant deviation from health goals. Time for a family health huddle.",
  },
];

export function DriftScoreShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExample = driftExamples[activeIndex];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl p-8 sm:p-12">
              <div className="flex justify-center mb-8">
                <DriftRing
                  key={activeExample.score}
                  score={activeExample.score}
                  size="lg"
                />
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeExample.title}
                </h3>
                <p className="text-gray-600">{activeExample.description}</p>
              </div>

              {/* Score selector */}
              <div className="flex justify-center gap-2">
                {driftExamples.map((example, index) => (
                  <Button
                    key={example.score}
                    variant={activeIndex === index ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setActiveIndex(index)}
                  >
                    {example.score}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Daily Health Compass
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              The Drift Score is a simple 0-100 number that shows how well
              you&apos;re staying on track with your health goals.
            </p>

            <div className="space-y-4">
              {[
                {
                  range: "80-100",
                  label: "On Track",
                  color: "bg-success-500",
                  description: "You're crushing it! Keep up the great work.",
                },
                {
                  range: "60-79",
                  label: "Mild Drift",
                  color: "bg-primary-500",
                  description: "Small adjustments needed. AI coach will help.",
                },
                {
                  range: "40-59",
                  label: "Moderate",
                  color: "bg-accent-500",
                  description: "Time to refocus. Your Care Circle is notified.",
                },
                {
                  range: "0-39",
                  label: "Needs Help",
                  color: "bg-danger-500",
                  description: "Significant drift detected. Let's get back on track together.",
                },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-500">
                        {item.range}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
