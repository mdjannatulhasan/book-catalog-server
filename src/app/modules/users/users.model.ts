/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./users.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const UserScema = new Schema<IUser, Record<string, never>, IUserMethods>(
	{
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
		email: {
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

UserScema.methods.isUserExists = async (email: string): Promise<Partial<IUser> | null> => {
	return await User.findOne({ email: email }, { _id: 1, password: 1, email: 1 });
};

UserScema.methods.isPasswordMatched = async (givenPassword: string, savedPassword: string): Promise<boolean> => {
	const isMatched = bcrypt.compare(givenPassword, savedPassword);
	return isMatched;
};

UserScema.pre("save", async function (next) {
	// hashing user password
	const user = this;
	user.password = await bcrypt.hash(user.password, Number(config.bycrypt_salt_rounds));
	next();
});

export const User = model<IUser, UserModel>("User", UserScema);
