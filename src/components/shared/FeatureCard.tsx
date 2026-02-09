"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Users,
  Activity,
  Heart,
  Pill,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  bot: Bot,
  users: Users,
  activity: Activity,
  heart: Heart,
  pill: Pill,
  shield: Shield,
};

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-600",
    ring: "ring-primary-500/20",
  },
  accent: {
    bg: "bg-accent-100",
    text: "text-accent-600",
    ring: "ring-accent-500/20",
  },
  success: {
    bg: "bg-success-100",
    text: "text-success-600",
    ring: "ring-success-500/20",
  },
  danger: {
    bg: "bg-danger-100",
    text: "text-danger-600",
    ring: "ring-danger-500/20",
  },
  info: {
    bg: "bg-info-100",
    text: "text-info-600",
    ring: "ring-info-500/20",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    ring: "ring-purple-500/20",
  },
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color?: string;
  index?: number;
}

export function FeatureCard({
  icon,
  title,
  description,
  color = "primary",
  index = 0,
}: FeatureCardProps) {
  const Icon = iconMap[icon] || Activity;
  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover:scale-[1.02] transition-transform duration-300">
        <CardContent className="p-6">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 ring-4",
              colors.bg,
              colors.ring
            )}
          >
            <Icon className={cn("h-6 w-6", colors.text)} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
