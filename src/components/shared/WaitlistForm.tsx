"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  role: z.enum(["patient", "caregiver", "both"], {
    required_error: "Please select your role",
  }),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  variant?: "default" | "compact";
  className?: string;
}

export function WaitlistForm({
  variant = "default",
  className,
}: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      role: "both",
    },
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join waitlist");
      }

      setStatus("success");
      reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex flex-col items-center justify-center text-center p-6 bg-success-50 rounded-2xl",
          className
        )}
      >
        <CheckCircle2 className="h-12 w-12 text-success-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          You&apos;re on the list!
        </h3>
        <p className="text-sm text-gray-600">
          We&apos;ll notify you when uBelong.ai launches. Thank you for your interest!
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
    >
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={errors.email ? "border-danger-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-danger-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone (optional) */}
      {variant === "default" && (
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number (optional)</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="98765 43210"
              {...register("phone")}
              className={cn(
                "rounded-l-none",
                errors.phone ? "border-danger-500" : ""
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-danger-500">{errors.phone.message}</p>
          )}
        </div>
      )}

      {/* Role */}
      <div className="space-y-2">
        <Label>I am a... *</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "patient", label: "Patient" },
            { value: "caregiver", label: "Caregiver" },
            { value: "both", label: "Both" },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex-1 min-w-[80px] cursor-pointer rounded-xl border-2 px-4 py-2 text-center text-sm font-medium transition-all",
                "hover:border-primary-300 hover:bg-primary-50"
              )}
            >
              <input
                type="radio"
                value={option.value}
                {...register("role")}
                className="sr-only"
              />
              <span className="peer-checked:text-primary-600">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p className="text-sm text-danger-500">{errors.role.message}</p>
        )}
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-danger-500 bg-danger-50 p-3 rounded-xl">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join the Waitlist"
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By joining, you agree to our{" "}
        <a href="/privacy" className="text-primary-500 hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" className="text-primary-500 hover:underline">
          Terms of Service
        </a>
        .
      </p>
    </form>
  );
}
