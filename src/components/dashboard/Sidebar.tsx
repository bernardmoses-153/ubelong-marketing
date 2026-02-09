"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials, getFullName } from "@/lib/auth";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/patients",
    label: "Patients",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 font-bold text-primary-600",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">u</span>
          </div>
          {!collapsed && <span className="text-xl">uBelong</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed ? "justify-center" : ""
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-gray-400"
                )}
              />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-100">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary-700">
              {getInitials(user)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getFullName(user)}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-danger-600 transition-colors w-full mt-2",
            collapsed ? "justify-center" : ""
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
