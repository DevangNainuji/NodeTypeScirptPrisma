import dotenv from "dotenv";

dotenv.config();

export const env = {
    APP_HOST: process.env.APP_HOST || "localhost",
    APP_PORT: Number(process.env.APP_PORT) || 4000,

    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_PORT: Number(process.env.DB_PORT) || 3306,
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "",

    ACCESS_SECRET: process.env.ACCESS_SECRET!,
    REFRESH_SECRET: process.env.REFRESH_SECRET!,

    ACCESS_EXPIRES: "15m",
    REFRESH_EXPIRES: "7d",

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
