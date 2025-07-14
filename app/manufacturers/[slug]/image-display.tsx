"use client";
import Image from "next/image";
import { useState } from "react";

const supaBaseImageRoot =
  "https://soppaekplyccyhrfkauf.supabase.co/storage/v1/object/public/manufacturers/";

export const ImageDisplay = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="image-gallery">
      <div className="large-image mb-4 w-1/2">
        <Image
          src={`${supaBaseImageRoot}${selectedImage}`}
          alt="Selected"
          className="w-full h-auto rounded-md"
          width={800}
          height={600}
        />
      </div>
      <div className="thumbnails flex space-x-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className="thumbnail w-20 h-20 border border-gray-300 rounded-md overflow-hidden"
          >
            <Image
              src={`${supaBaseImageRoot}${image}`}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
