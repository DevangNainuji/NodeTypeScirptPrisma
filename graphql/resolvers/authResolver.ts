import authService from "../../services/authService.js";

const authResolver = {
    Mutation: {
        login: (
            _: unknown,
            args: { email: string; password: string },
            context: any
        ) => {
            return authService.login(args, context.res);
        },

        refreshToken: (
            _: unknown,
            __: unknown,
            context: any
        ) => {
            return authService.refreshToken(
                context.req,
                context.res
            );
        },

        logout: (
            _: unknown,
            __: unknown,
            context: any
        ) => {
            return authService.logout(context.res);
        },
    },
};

export default authResolver;