/** Optional editorial imagery, to be selected by the owner. Empty slots render without an image. */
export type EditorialImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: { label: string; url?: string };
};

export const editorialImages: Record<"home" | "about", EditorialImage | null> = {
  home: null,
  about: null,
};

export type EditorialImageSlotName = keyof typeof editorialImages;
