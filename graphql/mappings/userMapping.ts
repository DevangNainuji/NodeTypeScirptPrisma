export const userMappings = {
    role: {
        key: "userRoles",
        value: {
            select: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: {
                                        id: true,
                                        module: true,
                                        name: true,
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
};