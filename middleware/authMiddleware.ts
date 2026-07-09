import { verifyAccessToken } from "../lib/jwt.js";
import permissionService from "../services/permissionService.js";
import { defineAbility } from "../lib/ability.js";

export const authMiddleware = async (req: any) => {

    const token = req.cookies.accessToken;

    if (!token) return null;

    const user = verifyAccessToken(token) as any;

    const { permissions, isSuperAdmin } =   await permissionService.getUserPermissions(user.id);

    const ability = defineAbility(
        permissions,
        isSuperAdmin
    );

    return {
        ...user,
        permissions,
        isSuperAdmin,
        ability,
    };
};