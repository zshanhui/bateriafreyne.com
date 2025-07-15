"use client";
import { useState } from "react";

const supaBaseImageRoot =
  "https://soppaekplyccyhrfkauf.supabase.co/storage/v1/object/public/manufacturers/";

export const ImageDisplay = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  console.log("images >> ", images);

  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setShowLeftShadow(container.scrollLeft > 0);
    setShowRightShadow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  return (
    <div className="image-gallery w-1/2 bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="large-image mb-6">
        <img
          src={`${supaBaseImageRoot}${selectedImage}`}
          alt="Selected"
          className="w-full h-auto rounded-lg shadow-md border-2 border-gray-200"
          width={800}
          height={600}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/fallback-image.jpg";
          }}
        />
      </div>
      <div className="relative bg-white p-4 rounded-md shadow-inner">
        <div
          className="thumbnails flex space-x-3 overflow-scroll p-2 pl-0 scrollbar-hide"
          onScroll={handleScroll}
        >
          {showLeftShadow && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          )}
          {images.map((image, index) => (
            <div className="flex-shrink-0" key={index}>
              <button
                onClick={() => setSelectedImage(image)}
                className={`thumbnail w-20 h-20 border-2 rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedImage === image
                    ? "border-blue-600 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={`${supaBaseImageRoot}${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-sm"
                  width={80}
                  height={80}
                />
              </button>
            </div>
          ))}
          {showRightShadow && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          )}
        </div>
      </div>
    </div>
  );
};
