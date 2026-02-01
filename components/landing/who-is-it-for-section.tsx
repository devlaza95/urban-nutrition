import { PortableTextRenderer } from "@/components/portable-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WhoIsItForItem } from "@/lib/sanity/types";

export function WhoIsItForSection({ items }: { items: WhoIsItForItem[] }) {
  return (
    <section id="kome-je-namenjen" className="scroll-mt-24 mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">
        Kome je namenjen
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(items || []).map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <PortableTextRenderer value={item.description} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
