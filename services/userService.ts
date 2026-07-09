import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import {
    GetUserArgs,
    CreateUserArgs,
    UpdateUserArgs,
} from "../types/userType.js";

class UserService {

    async getUsers({ id }: GetUserArgs) {

        const users = await prisma.user.findMany({
            ...(id && {
                where: { id },
            }),
            include: {
                userRoles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const result = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.userRoles.length
                ? {
                    id: user.userRoles[0].role.id,
                    name: user.userRoles[0].role.name,
                }
                : null,
        }));

        return id ? result[0] : result;
    }

    async createUser({
        name,
        email,
        password,
        confirmPassword,    
        roleId,
    }: CreateUserArgs) {

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
                                id: roleId,
                            },
                        },
                    },
                },
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: {
                id: user.userRoles[0].role.id,
                name: user.userRoles[0].role.name,
            },
        };
    }

    async updateUser({
        id,
        name,
        email,
        roleId,
    }: UpdateUserArgs) {

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
            include: {
                userRoles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            id: user!.id,
            name: user!.name,
            email: user!.email,
            role: user!.userRoles.length
                ? {
                    id: user!.userRoles[0].role.id,
                    name: user!.userRoles[0].role.name,
                }
                : null,
        };
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