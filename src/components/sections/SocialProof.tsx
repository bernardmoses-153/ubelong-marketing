"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Finally, an app that understands Indian families. Managing my mother's diabetes used to be chaos. Now our whole family is on the same page.",
    author: "Priya S.",
    role: "Caregiver",
    avatar: "PS",
  },
  {
    quote:
      "The Drift Score changed everything. I can see at a glance if my father needs help, even though I live in a different city.",
    author: "Rahul M.",
    role: "Family member",
    avatar: "RM",
  },
  {
    quote:
      "The AI coach feels like having a knowledgeable friend who actually understands diabetes management. It's personalized and practical.",
    author: "Anita K.",
    role: "Patient",
    avatar: "AK",
  },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Waitlist count */}
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <div className="flex -space-x-2">
              {["PS", "RM", "AK", "VG"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-medium border-2 border-primary-900"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm">
              <strong>500+</strong> families on the waitlist
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by families across India
          </h2>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Early access members are already seeing results. Here&apos;s what they say.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent-400 text-accent-400"
                  />
                ))}
              </div>

              <p className="text-primary-100 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-primary-300">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
