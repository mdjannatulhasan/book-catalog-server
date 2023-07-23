/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IAdmin, AdminModel, IAdminMethods } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const AdminScema = new Schema<IAdmin, Record<string, unknown>, IAdminMethods>(
    {
        role: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        name: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);
AdminScema.methods.isAdminExists = async (
    phoneNumber: string
): Promise<Partial<IAdmin> | null> => {
    return await Admin.findOne(
        { phoneNumber: phoneNumber },
        { _id: 1, password: 1, role: 1 }
    );
};

AdminScema.methods.isPasswordMatched = async (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> => {
    const isMatched = bcrypt.compare(givenPassword, savedPassword);
    return isMatched;
};

AdminScema.pre('save', async function (next) {
    // hashing Admin password
    const admin = this;
    admin.password = await bcrypt.hash(
        admin.password,
        Number(config.bycrypt_salt_rounds)
    );
    next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminScema);
