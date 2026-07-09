export const checkPermission = (permission: string) => (resolver: Function) => {
    return async (parent: any, args: any, context: any, info: any) => {

        if (!context.user) {
            throw new Error("Unauthorized");
        }

        if (!context.user.ability) {
            throw new Error("Unauthorized");
        }

        if (!context.user.ability.can(permission, "all")) {
            throw new Error("Forbidden");
        }

        return resolver(
            parent,
            args,
            context,
            info
        );
    };
};