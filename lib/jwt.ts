import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

const ACCESS_SECRET = env.ACCESS_EXPIRES;
const REFRESH_SECRET = env.REFRESH_EXPIRES;

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);