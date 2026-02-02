import { PortableTextRenderer } from "@/components/portable-text";
import { ProductImageSwitcher } from "@/components/products/product-image-switcher";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { anton, inter } from "@/lib/fonts";
import type { Product } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function formatRsd(price: number) {
  return `${price.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2,
  })} RSD`;
}

export function ProteinSection({ product }: { product: Product | null }) {
  return (
    <section id="protein" className="scroll-mt-24 mt-20 pt-4 bg-[#F2F1FF]">
      <div className="mx-auto w-full max-w-[85%] px-6">
        <h2
          className={cn(
            anton.className,
            "text-center text-[46px] font-normal text-foreground",
          )}
        >
          Naruči proizvod
        </h2>
        <h3
          className={cn(
            inter.className,
            "text-center text-[18px] leading-[83px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Počni svoju rutinu već danas. Izaberi protein koji je jednostavan,
          prijatan i premium.
        </h3>
      </div>

      <div className="mt-8">
        <div className="mx-auto w-full max-w-[85%] px-6 py-12">
          {!product ? (
            <div
              className={cn(
                inter.className,
                "rounded-3xl bg-background px-6 py-10 text-center text-sm text-muted-foreground",
              )}
            >
              Add a product in the CMS to show it here.
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <ProductImageSwitcher
                images={product.images}
                productName={product.name || "Product"}
              />

              <div className="space-y-5">
                <RatingStars rating={product.rating} />

                <div className="space-y-6">
                  <div>
                    <div
                      className={cn(
                        anton.className,
                        "text-[32px] tracking-[0px] font-normal text-foreground",
                      )}
                    >
                      {product.name}
                    </div>

                    {typeof product.price === "number" ? (
                      <div
                        className={cn(
                          anton.className,
                          "text-brand text-[24px] tracking-[0px] font-normal",
                        )}
                      >
                        {formatRsd(product.price)}
                      </div>
                    ) : null}
                  </div>
                  {product.shortDescription ? (
                    <p
                      className={cn(
                        inter.className,
                        "text-[18px] leading-[18px] tracking-[0px] font-normal text-foreground",
                      )}
                    >
                      {product.shortDescription}
                    </p>
                  ) : null}
                </div>

                <Button className="h-12 rounded-full px-10 text-base font-semibold">
                  KUPI PROTEIN
                </Button>

                <Separator className="my-4" />

                <Tabs defaultValue="opis" className="w-full">
                  <TabsList variant="line" className="h-auto p-0 gap-6">
                    <TabsTrigger
                      value="opis"
                      className={cn(
                        inter.className,
                        "h-auto flex-none rounded-none border-0 bg-transparent px-0 py-2 text-[22px] leading-[22px] font-semibold text-foreground data-[state=active]:text-brand after:bg-brand",
                      )}
                    >
                      Opis
                    </TabsTrigger>
                    <TabsTrigger
                      value="info"
                      className={cn(
                        inter.className,
                        "h-auto flex-none rounded-none border-0 bg-transparent px-0 py-2 text-[22px] leading-[22px] font-semibold text-foreground data-[state=active]:text-brand after:bg-brand",
                      )}
                    >
                      Informacije o proizvodu
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="opis" className="pt-4">
                    <PortableTextRenderer
                      value={product.description}
                      className={cn(
                        inter.className,
                        "text-[18px] font-normal text-foreground",
                        "[&_p]:!text-foreground [&_p]:!text-[18px] [&_p]:!leading-[1.4]",
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="info" className="pt-4">
                    <PortableTextRenderer
                      value={
                        product.productInformation ?? product.allergiesInfo
                      }
                      className={cn(
                        inter.className,
                        "text-[18px] font-normal text-foreground",
                        "[&_p]:!text-foreground [&_p]:!text-[18px] [&_p]:!leading-[1.4]",
                        "[&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2",
                        "[&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2",
                        "[&_li]:text-[18px] [&_li]:leading-[1.4]",
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
