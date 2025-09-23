'use client';
import { useCallback, useRef, useState } from 'react';

const supaBaseImageRoot =
    'https://soppaekplyccyhrfkauf.supabase.co/storage/v1/object/public/manufacturers/';

export const ImageDisplay = ({
    images,
    logoImage,
}: {
    images: string[];
    logoImage?: string;
}) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    // console.log('[DEV] images >> ', images);

    const [showLeftShadow, setShowLeftShadow] = useState(false);
    const [showRightShadow, setShowRightShadow] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        setShowLeftShadow(container.scrollLeft > 0);
        setShowRightShadow(
            container.scrollLeft < container.scrollWidth - container.clientWidth
        );
    };

    const handleImageClick = useCallback(
        (image: string, index: number) => {
            setSelectedImage(image);

            if (!scrollContainerRef.current) return;

            const container = scrollContainerRef.current;
            const containerRect = container.getBoundingClientRect();
            const scrollLeft = container.scrollLeft;

            // Find all thumbnail elements
            const thumbnails = container.querySelectorAll('.thumbnail');
            if (!thumbnails[index]) return;

            const clickedThumbnail = thumbnails[index] as HTMLElement;
            const thumbnailRect = clickedThumbnail.getBoundingClientRect();

            // Check if this is the last visible thumbnail
            const isLastVisible =
                thumbnailRect.right >= containerRect.right - 10; // 10px tolerance

            if (isLastVisible) {
                // If it's the last image in the gallery, scroll to the end
                if (index === images.length - 1) {
                    container.scrollTo({
                        left: container.scrollWidth - container.clientWidth,
                        behavior: 'smooth',
                    });
                } else {
                    // Calculate how much to scroll to show at least 2 more thumbnails
                    const thumbnailWidth = thumbnailRect.width;
                    const spacing = 12; // space-x-3 = 12px
                    const scrollAmount = (thumbnailWidth + spacing) * 2; // Scroll by 2 thumbnails

                    // Smooth scroll to show more images
                    container.scrollTo({
                        left: scrollLeft + scrollAmount,
                        behavior: 'smooth',
                    });
                }
            }
        },
        [images.length]
    );

    return (
        <div className="image-gallery w-full rounded-lg bg-gray-100 p-6 shadow-lg">
            <div className="large-image mb-6">
                <img
                    src={`${supaBaseImageRoot}${selectedImage}`}
                    alt="Selected"
                    className="h-auto w-full rounded-lg border-2 border-gray-200 shadow-md"
                    width={800}
                    height={600}
                    onError={e => {
                        const target = e.target as HTMLImageElement;
                        if (logoImage) {
                            target.src = logoImage;
                            target.className =
                                'max-h-1/2 max-w-1/2 rounded-lg border-2 border-gray-200 shadow-md bg-gray-200 object-contain p-4';
                        } else {
                            target.src = 'https://placecats.com/300/200';
                        }
                    }}
                />
            </div>
            <div className="relative rounded-md bg-white p-4 shadow-inner">
                <div
                    ref={scrollContainerRef}
                    className="thumbnails scrollbar-hide flex space-x-3 overflow-scroll p-2 pl-0"
                    onScroll={handleScroll}
                >
                    {showLeftShadow && (
                        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent"></div>
                    )}
                    {images.map((image, index) => (
                        <div className="flex-shrink-0" key={index}>
                            <button
                                onClick={() => handleImageClick(image, index)}
                                className={`thumbnail h-20 w-20 cursor-pointer rounded-md border-2 transition-all duration-200 hover:shadow-lg ${
                                    selectedImage === image
                                        ? 'border-blue-600 shadow-md'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <img
                                    src={`${supaBaseImageRoot}${image}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="h-full w-full rounded-sm object-cover"
                                    width={80}
                                    height={80}
                                    onError={e => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        if (logoImage) {
                                            target.src = logoImage;
                                            target.className =
                                                'max-h-full max-w-full rounded-sm object-contain bg-gray-200 p-2';
                                        } else {
                                            target.src =
                                                'https://placecats.com/300/200';
                                        }
                                    }}
                                />
                            </button>
                        </div>
                    ))}
                    {showRightShadow && (
                        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-gradient-to-l from-white to-transparent"></div>
                    )}
                </div>
            </div>
        </div>
    );
};
