"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Users2, Brain } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Scattered Health Data",
    description:
      "Blood sugar logs in one app, medications in another, doctor notes on paper. Critical information gets lost.",
  },
  {
    icon: Clock,
    title: "Missed Medications",
    description:
      "Busy lives lead to forgotten doses. Without consistent tracking, chronic conditions spiral out of control.",
  },
  {
    icon: Users2,
    title: "Disconnected Caregivers",
    description:
      "Family members want to help but lack visibility. Caring for parents or children becomes a guessing game.",
  },
  {
    icon: Brain,
    title: "Information Overload",
    description:
      "Endless health advice online but no personalized guidance. What works for you? For your family?",
  },
];

export function Problem() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Managing family health is hard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            77 million Indians live with diabetes. Most families struggle to
            stay on top of chronic conditions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center mb-4">
                <problem.icon className="h-6 w-6 text-danger-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-gray-600">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
