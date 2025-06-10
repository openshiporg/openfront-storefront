import { cn } from "@/lib/utils" 
// Removed Container import
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@/features/storefront/modules/common/icons/placeholder-image"

// Define inline type based on GraphQL Image schema
type ImageInfoForThumbnail = {
  id?: string; // ID might not be present depending on query
  url?: string | null;
};

type ThumbnailProps = {
  thumbnail?: string | null;
  images?: any[] | null;
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
  "data-testid"?: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage =
    thumbnail ||
    images?.[0]?.url ||
    images?.[0]?.image?.url ||
    images?.[0]?.imagePath ||
    "/images/placeholder.svg";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden p-4 bg-muted shadow-sm rounded-lg group-hover:shadow-md transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
