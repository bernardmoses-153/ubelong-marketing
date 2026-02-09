"use client";

import { cn, getDriftColor, getDriftLabel } from "@/lib/utils";

interface DriftBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function DriftBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: DriftBadgeProps) {
  const color = getDriftColor(score);
  const label = getDriftLabel(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <span className="font-bold">{score}</span>
      {showLabel && <span className="opacity-80">{label}</span>}
    </div>
  );
}

interface DriftRingBadgeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DriftRingBadge({
  score,
  size = 48,
  strokeWidth = 4,
  className,
}: DriftRingBadgeProps) {
  const color = getDriftColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-sm font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
