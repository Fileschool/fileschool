import { IBaseEntity } from "@/interfaces/common.interface";

export interface IListing extends IBaseEntity {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  status: "active" | "pending" | "sold";
}

export interface IListingImage extends IBaseEntity {
  id: string;
  listingId: string;
  handle: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  order: number;
}

/** A non-image file attached to a listing (inspection report, floor plan, etc.). */
export interface IListingDocument extends IBaseEntity {
  id: string;
  listingId: string;
  handle: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  /** Human-friendly label, e.g. "Inspection Report". Falls back to filename. */
  label?: string;
  order: number;
}

/** A listing with its associated images and (optionally) documents. */
export interface IListingWithImages extends IListing {
  images: IListingImage[];
  documents?: IListingDocument[];
}

/** DTO for uploaded image metadata from Filestack picker. */
export interface IUploadedImage {
  handle: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

/** DTO for uploaded document metadata. Same shape as IUploadedImage but kept distinct for clarity. */
export type IUploadedDocument = IUploadedImage;

/** DTO for creating a new listing. */
export interface ICreateListingDTO {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  images: IUploadedImage[];
}

/** Property type options. */
export type PropertyType = "house" | "apartment" | "condo" | "townhouse";

export const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Condo", value: "condo" },
  { label: "Townhouse", value: "townhouse" },
];

/** Listing status options. */
export type ListingStatus = "active" | "pending" | "sold";

/** Props for ListingCard component. */
export interface IListingCardProps {
  listing: IListingWithImages;
}

/** Props for ListingGrid component. */
export interface IListingGridProps {
  listings: IListingWithImages[];
}

/** Props for ImageGallery component. */
export interface IImageGalleryProps {
  images: IListingImage[];
}

/** Props for FilestackUploader component. */
export interface IFilestackUploaderProps {
  onUploadDone: (files: IUploadedImage[]) => void;
  maxFiles?: number;
  /** Switches accept, copy, and icon. Defaults to "image". */
  mode?: "image" | "document";
}
