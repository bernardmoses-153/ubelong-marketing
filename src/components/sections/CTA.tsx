"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your family&apos;s health journey?
          </h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Join 500+ families already on the waitlist. Be the first to know
            when uBelong.ai launches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="xl"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="xl"
              className="text-white hover:bg-white/10"
            >
              <Link href="/features">Learn More</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-200">
            Free to join. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
