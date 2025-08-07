import { getManufacturerFrontPage } from 'lib/shopify';
import { notFound } from 'next/navigation';
import { ChatInterface } from './chat-interface';

export default async function ChatPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const manufacturer = getManufacturerFrontPage(slug);

    if (!manufacturer || !manufacturer.frontmatter) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Manufacturer Header */}
            <div className="border-b border-gray-700 bg-gray-900/80 shadow-lg backdrop-blur-sm">
                <div className="mx-auto max-w-4xl px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <img
                                src={manufacturer.frontmatter.logoImage}
                                alt={`${manufacturer.frontmatter.title} logo`}
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-gray-100">
                                {manufacturer.frontmatter.title}
                            </h1>
                            <p className="text-sm text-gray-400">
                                Chat with our AI sales assistant
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                                <span className="text-sm text-gray-300">
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="mx-auto max-w-4xl px-4 py-6">
                <ChatInterface manufacturer={manufacturer} />
            </div>

            {/* Footer */}
            <div className="mx-auto max-w-4xl px-4 pb-6">
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Powered by{' '}
                        <span className="font-semibold text-gray-400">
                            23Kuajing Technologies
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
