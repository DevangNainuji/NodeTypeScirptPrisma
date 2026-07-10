import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../lib/jwt.js";
import {
    setAuthCookies,
    clearAuthCookies,
} from "../utils/cookies.js";
import permissionService from "./permissionService.js";

class AuthService {

    async login({ email, password }: any, res: any) {

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            throw new Error("Invalid credentials");
        }

        const payload = {
            id: user.id,
            email: user.email,
        };

        const accessToken = generateAccessToken(payload);

        const refreshToken = generateRefreshToken(payload);

        setAuthCookies(
            res,
            accessToken,
            refreshToken
        );

        const { permissions, isSuperAdmin } = await permissionService.getUserPermissions(user.id);

        return {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            isSuperAdmin,
            permissions,
        };
    }

    async refreshToken(req: any, res: any) {

        const token = req.cookies.refreshToken;

        if (!token) {
            throw new Error("Unauthorized");
        }

        const payload = verifyRefreshToken(token) as any;

        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
        });

        setAuthCookies(
            res,
            accessToken,
            refreshToken
        );

        const { permissions, isSuperAdmin } = await permissionService.getUserPermissions(user.id);
        return {
            success: true,
            message: "Token refreshed",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            isSuperAdmin,
            permissions,
        };
    }

    logout(res: any) {
        clearAuthCookies(res);
        return "Logout successful";
    }
}

export default new AuthService();