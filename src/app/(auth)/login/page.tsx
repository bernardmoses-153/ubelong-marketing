"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, Stethoscope } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, error, clearError, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-600">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">u</span>
            </div>
            uBelong
          </Link>
          <p className="text-gray-500 mt-2">Doctor Portal</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-primary-600" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your patient dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={errors.email ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-danger-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register("password")}
                    className={errors.password ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-danger-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 text-center">
            <p className="text-sm text-gray-500">
              This portal is for registered healthcare providers only.
              <br />
              Contact your administrator if you need access.
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} uBelong. All rights reserved.
        </p>
      </div>
    </div>
  );
}
