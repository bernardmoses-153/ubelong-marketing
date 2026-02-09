"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DriftRing } from "@/components/shared/DriftRing";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Badge variant="purple" className="mb-4 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              {SITE_CONFIG.tagline.split(",").map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && ","}
                  {i === 0 && <br />}
                  {i === 1 && (
                    <span className="text-primary-500">{part}</span>
                  )}
                </span>
              ))}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              HIPAA-compliant family health platform with AI coaching. Manage
              diabetes, track medications, and keep your whole family healthy
              together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="xl">
                <Link href="/waitlist">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="xl">
                <Link href="/features">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              500+ families already on the waitlist
            </p>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Phone mockup with drift ring */}
            <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="h-12 bg-gray-50 flex items-center justify-center">
                  <div className="w-20 h-5 bg-gray-900 rounded-full" />
                </div>

                {/* App content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-primary-50">
                  <p className="text-xs text-gray-500 mb-2">Today&apos;s Score</p>
                  <DriftRing score={78} size="lg" />
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Great job! You&apos;re staying on track.
                  </p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                    {[
                      { label: "Meals", value: "3/3" },
                      { label: "Meds", value: "4/4" },
                      { label: "Steps", value: "8.2k" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl p-3 text-center shadow-sm"
                      >
                        <p className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs text-gray-500">AI Coach</p>
              <p className="text-sm font-medium text-gray-900">
                &quot;Time for your evening walk!&quot;
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -right-4 bottom-1/3 bg-white rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs text-gray-500">Family Update</p>
              <p className="text-sm font-medium text-gray-900">
                Mom logged her glucose
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
