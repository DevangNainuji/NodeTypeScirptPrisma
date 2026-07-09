import prisma from "../lib/prisma.js";

class PermissionService {
    async getUserPermissions(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                userRoles: {
                    select: {
                        role: {
                            select: {
                                slug: true,
                                rolePermissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                slug: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return {
                permissions: [],
                isSuperAdmin: false,
            };
        }

        const isSuperAdmin = user.userRoles.some(
            (userRole) => userRole.role.slug === "super-admin"
        );

        const permissions = [
            ...new Set(
                user.userRoles.flatMap((userRole) =>
                    userRole.role.rolePermissions.map(
                        (rolePermission) => rolePermission.permission.slug
                    )
                )
            ),
        ];

        return {
            permissions,
            isSuperAdmin,
        };
    }
}

export default new PermissionService();