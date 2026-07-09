import slugify from "slugify";
import prisma from "../lib/prisma.js";
import {
    CreateRoleArgs,
    DeleteRoleArgs,
    GetRoleArgs,
    UpdateRoleArgs,
} from "../types/roleType.js";

class RoleService {

    async getRoles({ id }: GetRoleArgs) {
        const roles = await prisma.role.findMany({
            ...(id && { where: { id } }),
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return roles.map(role => ({
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions.map(rp => rp.permission),
        }));
    }

    async getPermissions() {
        return await prisma.permission.findMany();
    }

    async createRole({ name, description, permissionIDs, }: CreateRoleArgs) {

        const slug = slugify(name, {
            lower: true,
            strict: true,
        });

        const exists = await prisma.role.findUnique({
            where: { slug },
        });

        if (exists) {
            throw new Error("Role already exists");
        }

        const role = await prisma.role.create({
            data: {
                name,
                slug,
                description,
                rolePermissions: {
                    create: permissionIDs.map((permissionId) => ({
                        permission: {
                            connect: {
                                id: Number(permissionId),
                            },
                        },
                    })),
                },
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions.map(rp => rp.permission),
        };
    }

    async updateRole({ id, name, description, permissionIDs, }: UpdateRoleArgs) {

        const slug = slugify(name, {
            lower: true,
            strict: true,
        });

        const role = await prisma.role.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                slug,
                description,

                rolePermissions: {
                    deleteMany: {},

                    create: permissionIDs.map((permissionId) => ({
                        permission: {
                            connect: {
                                id: Number(permissionId),
                            },
                        },
                    })),
                },
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions.map(rp => rp.permission),
        };
    }

    async deleteRole({ id }: DeleteRoleArgs) {

        const exists = await prisma.role.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!exists) {
            throw new Error("Role not found");
        }

        await prisma.role.delete({
            where: {
                id: Number(id),
            },
        });

        return "Role deleted successfully";
    }
}

export default new RoleService();