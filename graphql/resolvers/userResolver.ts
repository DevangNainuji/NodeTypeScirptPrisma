import { GraphQLResolveInfo } from "graphql";
import { checkPermission } from "../../middleware/permissionMiddleware.js";
import userService from "../../services/userService.js";
import {
    GetUserArgs,
    CreateUserArgs,
    UpdateUserArgs,
    DeleteUserArgs,
} from "../../types/userType.js";

const userResolver = {
    Query: {
        getUsers: checkPermission("list-users")(
            (_: unknown, args: GetUserArgs, __: unknown, info: GraphQLResolveInfo) => {
                return userService.getUsers(args, info);
            }
        ),
    },

    Mutation: {
        createUser: checkPermission("add-users")(
            (_: unknown, args: CreateUserArgs, __: unknown, info: GraphQLResolveInfo) => {
                return userService.createUser(args, info);
            }
        ),

        updateUser: checkPermission("edit-users")(
            (_: unknown, args: UpdateUserArgs, __: unknown, info: GraphQLResolveInfo) => {
                return userService.updateUser(args, info);
            }
        ),

        deleteUser: checkPermission("delete-users")(
            (_: unknown, args: DeleteUserArgs) => {
                return userService.deleteUser(args.id);
            }
        ),
    },
};

export default userResolver;