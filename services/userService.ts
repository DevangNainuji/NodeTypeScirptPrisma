import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import {
    GetUserArgs,
    CreateUserArgs,
    UpdateUserArgs,
} from "../types/userType.js";
import { GraphQLResolveInfo } from "graphql";
import { getPrismaSelect } from "../utils/getPrismaSelect.js";
import { userMappings } from "../graphql/mappings/userMapping.js";

class UserService {

    async getUsers({ id }: GetUserArgs, info: GraphQLResolveInfo) {

        const select = getPrismaSelect(info, undefined, userMappings);

        const users = await prisma.user.findMany({
            ...(id && {
                where: { id },
            }),
            select,
        });

        return users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.userRoles.length
                ? {
                    id: user.userRoles[0].role.id,
                    name: user.userRoles[0].role.name,
                    slug: user.userRoles[0].role.slug,
                    description: user.userRoles[0].role.description,

                    permissions: user.userRoles[0].role.rolePermissions.map(
                        (rp: any) => rp.permission
                    ),
                }
                : null,
        }));
    }

    async createUser({
        name,
        email,
        password,
        confirmPassword,
        roleId,
    }: CreateUserArgs,
        info: GraphQLResolveInfo
    ) {

        const select = getPrismaSelect(info, undefined, userMappings);

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                userRoles: {
                    create: {
                        role: {
                            connect: {
                                id: Number(roleId),
                            },
                        },
                    },
                },
            },
            select,
        }) as any;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.userRoles.length
                ? {
                    id: user.userRoles[0].role.id,
                    name: user.userRoles[0].role.name,
                    slug: user.userRoles[0].role.slug,
                    description: user.userRoles[0].role.description,
                    permissions: user.userRoles[0].role.rolePermissions.map(
                        (rp: any) => rp.permission
                    ),
                }
                : null,
        }
    }

    async updateUser({
        id,
        name,
        email,
        roleId,
    }: UpdateUserArgs,
        info: GraphQLResolveInfo
    ) {

        const select = getPrismaSelect(info, undefined, userMappings);

        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: true,
            },
        });

        if (!existingUser) {
            throw new Error("User not found");
        }

        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
            },
        });

        await prisma.userRole.deleteMany({
            where: {
                userId: id,
            },
        });

        await prisma.userRole.create({
            data: {
                user: {
                    connect: {
                        id,
                    },
                },
                role: {
                    connect: {
                        id: roleId,
                    },
                },
            },
        });

        const user = await prisma.user.findUnique({
            where: { id },
            select,
        }) as any;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.userRoles.length
                ? {
                    id: user.userRoles[0].role.id,
                    name: user.userRoles[0].role.name,
                    slug: user.userRoles[0].role.slug,
                    description: user.userRoles[0].role.description,
                    permissions: user.userRoles[0].role.rolePermissions.map(
                        (rp: any) => rp.permission
                    ),
                }
                : null,
        }
    }

    async deleteUser(id: number) {

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!existingUser) {
            throw new Error("User not found");
        }

        await prisma.user.delete({
            where: {
                id,
            },
        });

        return "User deleted successfully";
    }
}

export default new UserService();