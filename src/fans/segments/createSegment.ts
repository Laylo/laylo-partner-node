export type LayloLocation = {
  city: string;
  state?: string;
  country: string;
  radius: number;
};

export type CreateSegmentParams = {
  apiKey: string;
  dropIds?: string[];
  excludedDropIds?: string[];
  conversionIds?: string[];
  excludedConversionIds?: string[];
  locations?: LayloLocation[];
  excludedLocations?: LayloLocation[];
};

export type LayloSegment = {
  numberOfFans: number;
};

export const createSegment = async ({
  apiKey,
  dropIds,
  excludedDropIds,
  conversionIds,
  excludedConversionIds,
  locations,
  excludedLocations,
}: CreateSegmentParams): Promise<LayloSegment> => {};
