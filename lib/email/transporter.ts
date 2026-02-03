import nodemailer from "nodemailer";
import validator from "validator";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

if (process.env.NODE_ENV === "development") {
  transporter.verify((error: Error | null) => {
    if (error) {
      console.error("SMTP connection failed:", error);
    } else {
      console.log("SMTP connection verified successfully");
    }
  });
}

export const MAIL_FROM =
  process.env.MAIL_FROM || "Urban Nutrition <info@urban-nutrition.com>";
export const MAIL_TO_OFFICE =
  process.env.MAIL_TO_OFFICE || "info@urban-nutrition.com";

/**
 * Sanitize email address to prevent header injection
 * Removes newlines, carriage returns, null bytes, and validates format
 */
export function sanitizeEmailAddress(email: string): string {
  const trimmed = email.trim();
  const cleaned = trimmed.replace(/[\r\n\0]/g, "");

  if (!validator.isEmail(cleaned)) {
    throw new Error("Invalid email format");
  }

  const normalized = validator.normalizeEmail(cleaned);

  if (!normalized) {
    throw new Error("Invalid email format");
  }

  return normalized;
}
