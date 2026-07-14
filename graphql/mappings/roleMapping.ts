export const roleMappings = {
    permissions: {
        key: "rolePermissions",
        value: {
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
};