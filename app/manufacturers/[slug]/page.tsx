import type { Metadata } from "next";

import clsx from "clsx";
import { getManufacturerFrontPage } from "lib/shopify";
import { notFound } from "next/navigation";
import { ImageDisplay } from "./image-display";

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
        {/* start manufacturer header */}
        <div className="flex flex-col lg:flex-row">
          <section className="flex flex-col lg:flex-row items-center w-full lg:w-2/3 mb-4 lg:mb-0">
            <div className="flex-shrink-0 w-full lg:w-60 h-30 mb-4 lg:mb-0">
              <img
                src={page.frontmatter.logoImage}
                alt={`${page.frontmatter.title} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="lg:ml-6 w-full">
              <div
                className={clsx(
                  "flex flex-col lg:flex-row items-start lg:items-center",
                  page.frontmatter.textColor
                )}
              >
                <span className="mr-2 font-semibold">Brand name:</span>
                <span className="lg:ml-auto">
                  {page.frontmatter.title}
                </span>
              </div>

              <div
                className={clsx(
                  "flex flex-col lg:flex-row items-start lg:items-center",
                  page.frontmatter.textColor
                )}
              >
                <span className="mr-2 font-semibold">Legal name:</span>
                <span className="lg:ml-auto">{page.frontmatter.legalName}</span>
              </div>

              <div
                className={clsx(
                  "flex flex-col lg:flex-row items-start lg:items-center",
                  page.frontmatter.textColor
                )}
              >
                <span className="mr-2 font-semibold">Production address:</span>
                <span className="lg:ml-auto">
                  {page.frontmatter.factoryAddress}
                </span>
              </div>
            </div>
          </section>
          <section className="cta2 w-full lg:w-1/3 flex justify-center items-center p-6">
            <div className="flex gap-3">
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-xl cursor-pointer">
                View Products
              </button>
              <button className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-xl cursor-pointer">
                Chat with Agent
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <style>
            {`
        .markdown-content > h1,
        .markdown-content > h2,
        .markdown-content > h3,
        .markdown-content > h4,
        .markdown-content > p,
        .markdown-content > ul,
        .markdown-content > span {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
          `}
          </style>
          <div
            className="w-full lg:w-1/2 markdown-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          ></div>
          <div className="w-full lg:w-1/2">
            <ImageDisplay images={page.frontmatter.images || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
