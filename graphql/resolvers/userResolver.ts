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
            (_: unknown, args: GetUserArgs) => {
                return userService.getUsers(args);
            }
        ),
    },

    Mutation: {
        createUser: checkPermission("add-users")(
            (_: unknown, args: CreateUserArgs) => {
                return userService.createUser(args);
            }
        ),

        updateUser: checkPermission("edit-users")(
            (_: unknown, args: UpdateUserArgs) => {
                return userService.updateUser(args);
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