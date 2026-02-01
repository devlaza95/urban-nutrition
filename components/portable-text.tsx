import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { urlFor } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(1600).url()}
            alt={value?.alt || "Image"}
            width={1600}
            height={900}
            className="h-auto w-full rounded-lg border object-cover"
          />
          {value?.caption ? (
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      const isExternal = !!href && href.startsWith("http");
      return (
        <Link
          href={href || "#"}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline underline-offset-4"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="leading-7 text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
};

export function PortableTextRenderer({
  value,
  className,
}: {
  value: unknown;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableText value={value as never} components={components} />
    </div>
  );
}
