/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';

export type AdminRole = 'admin';

export type IAdmin = {
    _id: ObjectId;
    password: string;
    role: AdminRole;
    name: {
        firstName: string;
        lastName: string;
    };
    phoneNumber: string;
    address: string;
};
export type IAdminMethods = {
    isAdminExists(id: string): Promise<Partial<IAdmin> | null>;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
};
export type AdminModel = Model<IAdmin, object, IAdminMethods>;
