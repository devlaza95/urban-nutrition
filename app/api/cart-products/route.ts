import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { productByIdsQuery } from "@/lib/sanity/queries";
import type { Product } from "@/lib/sanity/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
    if (ids.length === 0) {
      return NextResponse.json([]);
    }
    const draftIds = ids.map((id) => `drafts.${id}`);
    const products = await sanityClient.fetch<Product[]>(productByIdsQuery, {
      ids,
      draftIds,
    });
    return NextResponse.json(products ?? []);
  } catch (error) {
    console.error("Cart products API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
