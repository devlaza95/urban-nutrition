import { renderTemplate, htmlToText } from "../template-loader";

interface ContactNotificationData {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export function getContactNotificationEmail(data: ContactNotificationData) {
  const submittedDate = new Date(data.timestamp).toLocaleString();

  const html = renderTemplate("contact-notification", {
    name: data.name,
    email: data.email,
    message: data.message,
    submittedDate,
  });

  const text = htmlToText(html);

  return {
    subject: `Nova poruka sa kontakt forme - ${data.name} - Urban Nutrition`,
    html,
    text,
  };
}
