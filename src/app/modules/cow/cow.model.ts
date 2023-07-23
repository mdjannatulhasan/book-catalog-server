import { Schema, model } from 'mongoose';
import {
    CowBreed,
    CowCategory,
    CowLabel,
    CowLocation,
    CowModel,
    ICow,
} from './cow.interface';

export const CowSchema = new Schema<ICow, CowModel>(
    {
        name: {
            type: String,
            required: true,
        },
        age: { type: Number, required: true },
        price: { type: Number, required: true },
        location: {
            type: String,
            enum: Object.values(CowLocation),
            required: true,
        },
        breed: {
            type: String,
            enum: Object.values(CowBreed),
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        label: {
            type: String,
            enum: Object.values(CowLabel),
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(CowCategory),
            required: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

export const Cow = model<ICow, CowModel>('Cow', CowSchema);
