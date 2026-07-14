import slugify from "slugify";
import prisma from "../lib/prisma.js";
import {
    CreateRoleArgs,
    DeleteRoleArgs,
    GetRoleArgs,
    UpdateRoleArgs,
} from "../types/roleType.js";
import { GraphQLResolveInfo } from "graphql";
import { getPrismaSelect } from "../utils/getPrismaSelect.js";
import { roleMappings } from "../graphql/mappings/roleMapping.js";

class RoleService {

    async getRoles({ id }: GetRoleArgs, info: GraphQLResolveInfo) {

        const select = getPrismaSelect(info, undefined, roleMappings);

        const roles = await prisma.role.findMany({
            ...(id && { where: { id } }),
            select,
        }) as any[];

        return roles.map(role => ({
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions?.map((rp: any) => rp.permission) ?? [],
        }));
    }

    async getPermissions() {
        return await prisma.permission.findMany();
    }

    async createRole(
        { name, description, permissionIDs, }: CreateRoleArgs,
        info: GraphQLResolveInfo
    ) {

        const select = getPrismaSelect(info, undefined, roleMappings);

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
            select
        }) as any;

        return {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions?.map((rp: any) => rp.permission) ?? [],
        };
    }

    async updateRole(
        { id, name, description, permissionIDs }: UpdateRoleArgs,
        info: GraphQLResolveInfo
    ) {

        const select = getPrismaSelect(info, undefined, roleMappings);

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
            select,
        }) as any;

        return {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            permissions: role.rolePermissions?.map((rp: any) => rp.permission) ?? [],
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