import { CowBreed, CowCategory, CowLabel, CowLocation } from './cow.interface';

export const CowLocations: CowLocation[] = [
    CowLocation.Dhaka,
    CowLocation.Chattogram,
    CowLocation.Barishal,
    CowLocation.Rajshahi,
    CowLocation.Sylhet,
    CowLocation.Comilla,
    CowLocation.Rangpur,
    CowLocation.Mymensingh,
];

export const CowBreeds: CowBreed[] = [
    CowBreed.Brahman,
    CowBreed.Nellore,
    CowBreed.Sahiwal,
    CowBreed.Gir,
    CowBreed.Indigenous,
    CowBreed.Tharparkar,
    CowBreed.Kankrej,
];

export const CowLabels: CowLabel[] = [CowLabel.ForSale, CowLabel.SoldOut];

export const CowCategories: CowCategory[] = [
    CowCategory.Dairy,
    CowCategory.Beef,
    CowCategory.DualPurpose,
];

export const cowFilterableFields = [
    'searchTerm',
    'minPrice',
    'maxPrice',
    'location',
];
export const cowSearchableFields = [
    'searchTerm',
    'minPrice',
    'maxPrice',
    'location',
];
