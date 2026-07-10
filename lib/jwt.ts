import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../utils/env.js";

const ACCESS_SECRET = env.ACCESS_SECRET;
const REFRESH_SECRET = env.REFRESH_SECRET;

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, env.ACCESS_SECRET, {
        expiresIn: env.ACCESS_EXPIRES as SignOptions["expiresIn"],
    });
};

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, env.REFRESH_SECRET, {
        expiresIn: env.REFRESH_EXPIRES as SignOptions["expiresIn"],
    });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);