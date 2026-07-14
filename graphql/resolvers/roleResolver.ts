import { GraphQLResolveInfo } from "graphql";
import { checkPermission } from "../../middleware/permissionMiddleware.js";
import roleService from "../../services/roleService.js";
import {
    GetRoleArgs,
    CreateRoleArgs,
    UpdateRoleArgs,
    DeleteRoleArgs,
} from "../../types/roleType.js";

const roleResolver = {
    Query: {
        getRoles: checkPermission("list-roles")(
            (_: unknown, args: GetRoleArgs, __: unknown, info: GraphQLResolveInfo) => {
                return roleService.getRoles(args, info);
            }
        ),

        getPermissions: checkPermission("list-roles")(
            () => roleService.getPermissions()
        )
    },

    Mutation: {
        createRole: checkPermission("add-roles")(
            (_: unknown, args: CreateRoleArgs, __: unknown, info: GraphQLResolveInfo) => {
                return roleService.createRole(args, info);
            }
        ),

        updateRole: checkPermission("edit-roles")(
            (_: unknown, args: UpdateRoleArgs, __: unknown, info: GraphQLResolveInfo) => {
                return roleService.updateRole(args, info);
            }
        ),

        deleteRole: checkPermission("delete-roles")(
            (_: unknown, args: DeleteRoleArgs) => {
                return roleService.deleteRole(args);
            }
        ),
    },
};

export default roleResolver;