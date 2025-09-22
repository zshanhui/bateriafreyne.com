import type { Metadata } from 'next';

import clsx from 'clsx';
import { getManufacturerFrontPage } from 'lib/shopify';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageDisplay } from './image-display';

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const page = getManufacturerFrontPage(params.slug);

    if (!page) return notFound();
    // console.log('manufacturer page contents >> ', page);

    return {
        // title: page.seo?.title || page.title,
        // description: page.seo?.description || page.bodySummary,
        title: 'manufacturer front page under development',
        description: 'under development',
        openGraph: {
            type: 'website',
        },
    };
}

export default async function Page(props: {
    params: Promise<{ slug: string }>;
}) {
    const params = await props.params;
    const page = await getManufacturerFrontPage(params.slug);

    if (!page || !page.frontmatter) {
        console.error('Page or frontmatter is undefined:', page);
        return notFound();
    }

    // console.log('page.content >> ', page.content);
    return (
        <div className="w-full">
            {/* Banner Image */}
            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                {page.frontmatter.bannerImage && (
                    <img
                        src={page.frontmatter.bannerImage}
                        alt="Manufacturer Banner"
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="px-4 text-center text-4xl font-bold text-white">
                        {page.frontmatter.title}
                    </h1>
                </div>
            </div>

            <div className="px-4 py-8">
                <div
                    className="mb-8 rounded-md p-6"
                    style={{
                        backgroundColor: page.frontmatter.backgroundColor,
                    }}
                >
                    {/* start manufacturer header */}
                    <div className="flex flex-col lg:flex-row">
                        <section className="mb-4 flex w-full flex-col items-center lg:mb-0 lg:w-2/3 lg:flex-row">
                            <div className="mb-4 h-30 w-full flex-shrink-0 lg:mb-0 lg:w-60">
                                <img
                                    src={page.frontmatter.logoImage}
                                    alt={`${page.frontmatter.title} logo`}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="w-full space-y-3 lg:ml-6">
                                <div
                                    className={clsx(
                                        'flex flex-col items-start space-y-1 lg:flex-row lg:items-center lg:space-y-0',
                                        page.frontmatter.textColor
                                    )}
                                >
                                    <span className="min-w-[140px] text-sm font-semibold tracking-wide uppercase opacity-80">
                                        Brand name:
                                    </span>
                                    <span className="font-medium lg:ml-auto">
                                        {page.frontmatter.title}
                                    </span>
                                </div>

                                <div
                                    className={clsx(
                                        'flex flex-col items-start space-y-1 lg:flex-row lg:items-center lg:space-y-0',
                                        page.frontmatter.textColor
                                    )}
                                >
                                    <span className="min-w-[140px] text-sm font-semibold tracking-wide uppercase opacity-80">
                                        Legal name:
                                    </span>
                                    <span className="font-medium lg:ml-auto">
                                        {page.frontmatter.legalName}
                                    </span>
                                </div>

                                <div
                                    className={clsx(
                                        'flex flex-col items-start space-y-1 lg:flex-row lg:items-center lg:space-y-0',
                                        page.frontmatter.textColor
                                    )}
                                >
                                    <span className="min-w-[140px] text-sm font-semibold tracking-wide uppercase opacity-80">
                                        Production address:
                                    </span>
                                    <span className="font-medium lg:ml-auto">
                                        {page.frontmatter.factoryAddress}
                                    </span>
                                </div>

                                {page.frontmatter.website && (
                                    <div
                                        className={clsx(
                                            'flex flex-col items-start space-y-1 lg:flex-row lg:items-center lg:space-y-0',
                                            page.frontmatter.textColor
                                        )}
                                    >
                                        <span className="min-w-[140px] text-sm font-semibold tracking-wide uppercase opacity-80">
                                            Website:
                                        </span>
                                        <span className="lg:ml-auto">
                                            <a
                                                href={page.frontmatter.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-500 underline decoration-2 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-700"
                                            >
                                                {page.frontmatter.website}
                                            </a>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                        <section className="cta2 flex w-full items-center justify-center p-6 lg:w-1/3">
                            <div className="flex gap-3">
                                <button className="cursor-pointer rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-cyan-500 hover:to-blue-600 hover:shadow-xl">
                                    View Catalog
                                </button>
                                <Link
                                    href={`/manufacturers/${params.slug}/chat-7171`}
                                    className="cursor-pointer rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-pink-500 hover:to-purple-600 hover:shadow-xl"
                                >
                                    Chat with Agent
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className="mt-6 flex flex-col gap-8 lg:flex-row">
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
                            className="markdown-content w-full lg:w-1/2"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        ></div>
                        <div className="w-full lg:w-1/2">
                            <ImageDisplay
                                images={page.frontmatter.images || []}
                                logoImage={page.frontmatter.logoImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
