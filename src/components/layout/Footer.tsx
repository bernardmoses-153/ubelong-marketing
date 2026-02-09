import Link from "next/link";
import { Shield, Lock, BadgeCheck, MapPin } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS, TRUST_BADGES } from "@/lib/constants";

const iconMap = {
  "shield-check": Shield,
  lock: Lock,
  "badge-check": BadgeCheck,
  "map-pin": MapPin,
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => {
              const Icon = iconMap[badge.icon as keyof typeof iconMap];
              return (
                <div
                  key={badge.label}
                  className="flex items-center justify-center space-x-2 text-sm"
                >
                  {Icon && <Icon className="h-5 w-5 text-primary-400" />}
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">u</span>
              </div>
              <span className="text-xl font-bold text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {SITE_CONFIG.description}
            </p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {SITE_CONFIG.email}
            </a>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            Built with care in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
