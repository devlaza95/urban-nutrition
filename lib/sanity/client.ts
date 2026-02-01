import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k0jjn03c";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === "production",
});
