import { NextResponse } from "next/server";
import { createBusinessInquiry } from "@/lib/inquiries/create";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashIp } from "@/lib/reference";
import { inquirySchema } from "@/lib/validation/inquiry";
import {
  isTechnologyInquiryType,
  technologyInquirySchema,
} from "@/lib/validation/technology-inquiry";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const inquiryType =
    typeof body === "object" &&
    body !== null &&
    "inquiryType" in body &&
    typeof (body as { inquiryType?: unknown }).inquiryType === "string"
      ? (body as { inquiryType: string }).inquiryType
      : undefined;

  const parsed = isTechnologyInquiryType(inquiryType ?? "")
    ? technologyInquirySchema.safeParse(body)
    : inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json(
      { ok: false, error: "Unable to process request." },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  const rate = await checkRateLimit(hashIp(ip), 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests. Please try again later.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      {
        status: 429,
        headers: rate.retryAfterSeconds
          ? { "Retry-After": String(rate.retryAfterSeconds) }
          : undefined,
      },
    );
  }

  const result = await createBusinessInquiry(parsed.data, {
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  if (!result.ok) {
    const status = result.code === "DUPLICATE" ? 409 : 500;
    return NextResponse.json(
      { ok: false, error: result.error, code: result.code },
      { status },
    );
  }

  return NextResponse.json({
    ok: true,
    reference: result.inquiry.reference,
    message:
      "Thank you. Your inquiry has been received. Please keep your reference number for follow-up.",
  });
}
