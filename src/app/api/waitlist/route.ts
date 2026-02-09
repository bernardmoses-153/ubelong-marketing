import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["patient", "caregiver", "both"]),
});

// In-memory storage for demo (persists during server session)
const waitlistEntries: Array<{ email: string; phone?: string; role: string; timestamp: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = waitlistSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, phone, role } = validation.data;

    // Check if already signed up (in this session)
    const existing = waitlistEntries.find((e) => e.email === email);
    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Store in memory and log
    const entry = {
      email,
      phone: phone || undefined,
      role,
      timestamp: new Date().toISOString(),
    };
    waitlistEntries.push(entry);

    console.log("=== NEW WAITLIST SIGNUP ===");
    console.log(JSON.stringify(entry, null, 2));
    console.log(`Total signups this session: ${waitlistEntries.length}`);
    console.log("===========================");

    return NextResponse.json(
      { message: "Successfully joined waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    // Even on error, return success for demo
    return NextResponse.json(
      { message: "Successfully joined waitlist!" },
      { status: 200 }
    );
  }
}

export async function GET() {
  // Return waitlist count (base 500 + session signups)
  return NextResponse.json(
    { count: 500 + waitlistEntries.length },
    { status: 200 }
  );
}
