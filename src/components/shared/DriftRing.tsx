"use client";

import { motion } from "framer-motion";
import { getDriftColor, getDriftLabel } from "@/lib/utils";

interface DriftRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const sizeMap = {
  sm: { outer: 80, stroke: 6, text: "text-lg", label: "text-xs" },
  md: { outer: 120, stroke: 8, text: "text-2xl", label: "text-sm" },
  lg: { outer: 180, stroke: 10, text: "text-4xl", label: "text-base" },
};

export function DriftRing({
  score,
  size = "md",
  showLabel = true,
  animated = true,
}: DriftRingProps) {
  const { outer, stroke, text, label } = sizeMap[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getDriftColor(score);
  const driftLabel = getDriftLabel(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={outer}
        height={outer}
        viewBox={`0 0 ${outer} ${outer}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut",
          }}
        />
        {/* Glow effect */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke * 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference, opacity: 0 }}
          animate={{
            strokeDashoffset: circumference - progress,
            opacity: 0.2,
          }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut",
          }}
          style={{ filter: "blur(8px)" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold ${text}`}
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: animated ? 0.5 : 0, duration: 0.3 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <motion.span
            className={`${label} text-gray-500 font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animated ? 0.8 : 0, duration: 0.3 }}
          >
            {driftLabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
