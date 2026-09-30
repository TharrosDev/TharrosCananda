import Image from "next/image";
import { editorialImages, type EditorialImageSlotName } from "@/data/editorial-images";
import "./editorial-image-slot.css";

export function EditorialImageSlot({
  slot,
  className = "",
}: {
  slot: EditorialImageSlotName;
  className?: string;
}) {
  const image = editorialImages[slot];
  return (
    <figure className={`editorial-image-slot ${className}`.trim()} data-editorial-slot={slot}>
      <div
        className="editorial-image-frame"
        data-empty={image ? undefined : ""}
        aria-hidden={image ? undefined : true}
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={
              slot === "about"
                ? "(max-width: 640px) 100vw, 440px"
                : "(max-width: 980px) 100vw, 66vw"
            }
          />
        )}
      </div>
      {image?.credit && (
        <figcaption>
          {image.credit.url ? (
            <a href={image.credit.url}>{image.credit.label}</a>
          ) : (
            image.credit.label
          )}
        </figcaption>
      )}
    </figure>
  );
}
