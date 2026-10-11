
export type SoldPixelDto = {
  pixel: number;
  donor: string | null;
};

export type HeartStateDto = {
  price: number;
  sold: SoldPixelDto[];
};


export type SoldPixels = ReadonlyMap<number, string | null>;

export const toSoldPixels = (heart: HeartStateDto): SoldPixels =>
  new Map(heart.sold.map(({ pixel, donor }) => [pixel, donor]));