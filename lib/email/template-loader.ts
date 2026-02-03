import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { join } from "path";

const templatesDir = join(process.cwd(), "lib", "email", "templates");

// Register Handlebars helpers
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

// Cache for compiled templates
const templateCache = new Map<string, Handlebars.TemplateDelegate>();

/**
 * Load and compile a Handlebars template (with caching)
 */
function loadTemplate(templateName: string): Handlebars.TemplateDelegate {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  const templatePath = join(templatesDir, `${templateName}.hbs`);
  const templateSource = readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateSource);

  templateCache.set(templateName, compiled);

  return compiled;
}

/**
 * Render a Handlebars template with data
 */
export function renderTemplate<T extends Record<string, unknown>>(
  templateName: string,
  data: T,
): string {
  const template = loadTemplate(templateName);
  return template(data);
}

/**
 * Generate plain text version from HTML (simple implementation)
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
