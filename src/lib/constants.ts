export const SITE_CONFIG = {
  name: "uBelong",
  tagline: "When patients drift, we activate the people around them",
  description: "uBelong detects when patients drift from care plans and rebuilds the support systems around them.",
  url: "https://ubelong.to",
  email: "hello@ubelong.to",
} as const;

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/waitlist", label: "Join Waitlist" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/waitlist", label: "Join Waitlist" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/hipaa", label: "HIPAA Compliance" },
  ],
} as const;

export const FEATURES = [
  {
    id: "ai-coaching",
    icon: "bot",
    title: "AI Health Coach",
    description: "Personalized guidance powered by Claude AI. Get evidence-based recommendations for managing diabetes, hypertension, and other chronic conditions.",
    color: "purple",
  },
  {
    id: "care-circles",
    icon: "users",
    title: "Care Circles",
    description: "Bring your family together. Coordinate care, share updates, and support each other through every health journey.",
    color: "primary",
  },
  {
    id: "drift-score",
    icon: "activity",
    title: "Drift Score",
    description: "Your daily health compass. Track how well you're staying on course with a simple 0-100 score that adapts to your goals.",
    color: "accent",
  },
  {
    id: "herd-view",
    icon: "heart",
    title: "Herd View",
    description: "See your whole family's health at a glance. Identify who needs attention and celebrate progress together.",
    color: "success",
  },
  {
    id: "medication-tracking",
    icon: "pill",
    title: "Medication Tracking",
    description: "Never miss a dose. Smart reminders and tracking help maintain medication adherence across your family.",
    color: "info",
  },
  {
    id: "hipaa-secure",
    icon: "shield",
    title: "HIPAA Compliant",
    description: "Your health data is sacred. Bank-level encryption and HIPAA compliance keep your family's information secure.",
    color: "danger",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Your Circle",
    description: "Sign up and invite family members to join your Care Circle. It takes less than 2 minutes.",
  },
  {
    step: 2,
    title: "Set Health Goals",
    description: "Work with our AI coach to establish personalized health targets for each family member.",
  },
  {
    step: 3,
    title: "Track Daily Progress",
    description: "Log meals, medications, and vitals. Watch your Drift Score guide you toward better health.",
  },
  {
    step: 4,
    title: "Stay Connected",
    description: "Get insights, celebrate wins, and support each other. Health is a family journey.",
  },
] as const;

export const PRICING_TIERS = [
  {
    id: "free",
    name: "Family Free",
    price: "₹0",
    period: "forever",
    description: "Get started with basic health tracking",
    features: [
      "1 Care Circle (up to 5 members)",
      "Basic Drift Score",
      "Medication reminders",
      "Weekly health summaries",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "plus",
    name: "Family Plus",
    price: "₹299",
    period: "/month",
    description: "Full AI coaching and family insights",
    features: [
      "Everything in Free",
      "Unlimited AI coaching sessions",
      "Advanced Drift analytics",
      "Herd View dashboard",
      "Priority support",
      "Export health reports",
    ],
    cta: "Join Waitlist",
    popular: true,
  },
  {
    id: "care",
    name: "Care Team",
    price: "₹999",
    period: "/month",
    description: "For families with complex care needs",
    features: [
      "Everything in Plus",
      "Multiple Care Circles",
      "Care team collaboration",
      "Doctor integration (coming soon)",
      "Custom health protocols",
      "Dedicated support",
    ],
    cta: "Contact Us",
    popular: false,
  },
] as const;

export const TRUST_BADGES = [
  { label: "HIPAA Compliant", icon: "shield-check" },
  { label: "256-bit Encryption", icon: "lock" },
  { label: "SOC 2 Type II", icon: "badge-check" },
  { label: "Indian Data Residency", icon: "map-pin" },
] as const;
