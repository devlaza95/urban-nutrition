"use server";

import { z } from "zod";
import {
  transporter,
  MAIL_FROM,
  MAIL_TO_OFFICE,
  sanitizeEmailAddress,
} from "@/lib/email/transporter";
import { getContactThankYouEmail } from "@/lib/email/templates/contact-thank-you";
import { getContactNotificationEmail } from "@/lib/email/templates/contact-notification";

const contactSchema = z.object({
  fullName: z.string().min(2, "Ime i prezime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite ispravnu email adresu"),
  message: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
});

export type ContactFormResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitContactForm(data: {
  fullName: string;
  email: string;
  message: string;
}): Promise<ContactFormResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.fullName?.[0] ??
      first.email?.[0] ??
      first.message?.[0] ??
      "Proverite unos.";
    return { success: false, error: msg };
  }

  const { fullName, email, message } = parsed.data;

  let sanitizedEmail: string;
  try {
    sanitizedEmail = sanitizeEmailAddress(email);
  } catch {
    return { success: false, error: "Neispravna email adresa." };
  }

  const timestamp = new Date().toISOString();

  try {
    const thankYou = getContactThankYouEmail(fullName);
    const notification = getContactNotificationEmail({
      name: fullName,
      email: sanitizedEmail,
      message,
      timestamp,
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: sanitizedEmail,
      subject: thankYou.subject,
      html: thankYou.html,
      text: thankYou.text,
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO_OFFICE,
      replyTo: sanitizedEmail,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    return {
      success: true,
      message: "Poruka je uspešno poslata. Javićemo vam se uskoro.",
    };
  } catch (err) {
    console.error("Contact form email error:", err);
    return {
      success: false,
      error: "Došlo je do greške pri slanju. Pokušajte ponovo kasnije.",
    };
  }
}
