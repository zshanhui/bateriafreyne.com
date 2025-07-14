import type { Metadata } from "next";

import clsx from "clsx";
import { getManufacturerFrontPage } from "lib/shopify";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getManufacturerFrontPage(params.slug);

  if (!page) return notFound();

  console.log("manufacturer page contents >> ", page);

  return {
    // title: page.seo?.title || page.title,
    // description: page.seo?.description || page.bodySummary,
    title: "manufacturer front page under development",
    description: "under development",
    openGraph: {
      type: "website",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = await getManufacturerFrontPage(params.slug);

  if (!page || !page.frontmatter) {
    console.error("Page or frontmatter is undefined:", page);
    return notFound();
  }

  console.log("page.content >> ", page.content);
  return (
    <div className="w-full px-4 py-8">
      <div
        className="rounded-md p-6 mb-8"
        style={{ backgroundColor: page.frontmatter.backgroundColor }}
      >
        {/* <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 12 * 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 border border-gray-300 flex items-center justify-center h-16"
        >
          {index + 1}
        </div>
          ))}
        </div> */}
        <div className="flex items-center w-full">
          <div className="flex-shrink-0 w-50 h-34 bg-gray-200 border border-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Placeholder Image</span>
          </div>
          <div className="ml-6">
            <div
              className={clsx("flex items-center", page.frontmatter.textColor)}
            >
              <label className="mr-2">Brand Name:</label>
              <span>{page.frontmatter.title}</span>
            </div>

            <div
              className={clsx("flex items-center", page.frontmatter.textColor)}
            >
              <label className="mr-2">Legal Name:</label>
              <span>{page.frontmatter.legalName}</span>
            </div>

            <div
              className={clsx("flex items-center", page.frontmatter.textColor)}
            >
              <label className="mr-2">Main factory address:</label>
              <span>{page.frontmatter.factoryAddress}</span>
            </div>
          </div>
        </div>
        <style>
          {`
            .markdown-content > h1, h2, h3, h4, p, ol, ul, span {
              font-size: 1rem;
              margin-bottom: 1rem;
            }
          `}
        </style>
        <div
          className="w-full markdown-content pl-5"
          dangerouslySetInnerHTML={{ __html: page.content }}
        ></div>
        // Example usage of the ImageGallery component
        {/* <ImageDisplay images={page.frontmatter.images || []} /> */}
      </div>
    </div>
  );
}
