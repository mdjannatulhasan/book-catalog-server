import { BookBreed, BookCategory, BookLabel, BookLocation } from "./book.interface";

export const BookLocations: BookLocation[] = [BookLocation.Dhaka, BookLocation.Chattogram, BookLocation.Barishal, BookLocation.Rajshahi, BookLocation.Sylhet, BookLocation.Comilla, BookLocation.Rangpur, BookLocation.Mymensingh];

export const BookBreeds: BookBreed[] = [BookBreed.Brahman, BookBreed.Nellore, BookBreed.Sahiwal, BookBreed.Gir, BookBreed.Indigenous, BookBreed.Tharparkar, BookBreed.Kankrej];

export const BookLabels: BookLabel[] = [BookLabel.ForSale, BookLabel.SoldOut];

export const BookCategories: BookCategory[] = [BookCategory.Dairy, BookCategory.Beef, BookCategory.DualPurpose];

export const bookFilterableFields = ["searchTerm", "minPrice", "maxPrice", "location"];
export const bookSearchableFields = ["searchTerm", "minPrice", "maxPrice", "location"];
