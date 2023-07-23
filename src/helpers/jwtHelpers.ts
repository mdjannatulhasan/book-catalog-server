import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const createToken = (payload: object, secret: Secret, options: object) => {
    return jwt.sign(payload, secret, options);
};

export const jwtHelpers = {
    createToken,
};
