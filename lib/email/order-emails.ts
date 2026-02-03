import { transporter, MAIL_FROM, MAIL_TO_OFFICE } from "./transporter";
import { getOrderNotificationEmail } from "./templates/order-notification";
import { getOrderConfirmationEmail } from "./templates/order-confirmation";
import type { OrderEmailPayload } from "./types";

export type SendOrderEmailsOptions = {
  /** When set, skip sending the customer confirmation (e.g. for testing). */
  skipCustomerConfirmation?: boolean;
};

/**
 * Sends all order-related emails: back-office notification and customer confirmation.
 * Extend this module (e.g. add sendOrderShippedEmail) when adding new email types.
 */
export async function sendOrderEmails(
  payload: OrderEmailPayload,
  options: SendOrderEmailsOptions = {},
): Promise<void> {
  const { skipCustomerConfirmation = false } = options;

  const notification = getOrderNotificationEmail(payload);
  const toOffice = transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO_OFFICE,
    replyTo: payload.email,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
  });

  const toCustomer = skipCustomerConfirmation
    ? Promise.resolve()
    : (() => {
        const confirmation = getOrderConfirmationEmail(payload);
        return transporter.sendMail({
          from: MAIL_FROM,
          to: payload.email,
          subject: confirmation.subject,
          html: confirmation.html,
          text: confirmation.text,
        });
      })();

  await Promise.all([toOffice, toCustomer]);
}
