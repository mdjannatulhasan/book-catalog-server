/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';

export type UserRole = 'seller' | 'buyer';

export type IUser = {
    password: string;
    role: UserRole;
    name: {
        firstName: string;
        lastName: string;
    };
    phoneNumber: string;
    address: string;
    budget: number;
    income: number;
};
export type ExtendedIUser = IUser & {
    _id: ObjectId;
};

export type IUserMethods = {
    isUserExists(id: string): Promise<Partial<IUser> | null>;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
