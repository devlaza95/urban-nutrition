import { renderTemplate, htmlToText } from "../template-loader";

export function getContactThankYouEmail(name: string) {
  const html = renderTemplate("contact-thank-you", { name });
  const text = htmlToText(html);

  return {
    subject: "Hvala vam što ste nas kontaktirali - Urban Nutrition",
    html,
    text,
  };
}
