/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUser } from '../users/users.interface';

export enum CowLocation {
    Dhaka = 'Dhaka',
    Chattogram = 'Chattogram',
    Barishal = 'Barishal',
    Rajshahi = 'Rajshahi',
    Sylhet = 'Sylhet',
    Comilla = 'Comilla',
    Rangpur = 'Rangpur',
    Mymensingh = 'Mymensingh',
}

export enum CowBreed {
    Brahman = 'Brahman',
    Nellore = 'Nellore',
    Sahiwal = 'Sahiwal',
    Gir = 'Gir',
    Indigenous = 'Indigenous',
    Tharparkar = 'Tharparkar',
    Kankrej = 'Kankrej',
}

export enum CowLabel {
    ForSale = 'for sale',
    SoldOut = 'sold out',
}

export enum CowCategory {
    Dairy = 'Dairy',
    Beef = 'Beef',
    DualPurpose = 'Dual Purpose',
}
export type ICow = {
    name: string;
    age: number;
    price: number;
    location: CowLocation;
    breed: CowBreed;
    weight: number;
    label: CowLabel;
    category: CowCategory;
    seller: Types.ObjectId | IUser;
};

export type CowModel = Model<ICow, object>;

export type ICowFilters = {
    searchTerm: string;
};
export type ITokenInfo = {
    _id: string;
    role: string;
    iat: number;
    exp: number;
};
