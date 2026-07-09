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
            (_: unknown, args: GetRoleArgs) => {
                return roleService.getRoles(args);
            }
        ),

        getPermissions: checkPermission("list-roles")(
            (_: unknown) => {
                return roleService.getPermissions();
            },
        )
    },

    Mutation: {
        createRole: checkPermission("add-roles")(
            (_: unknown, args: CreateRoleArgs) => {
                return roleService.createRole(args);
            }
        ),

        updateRole: checkPermission("edit-roles")(
            (_: unknown, args: UpdateRoleArgs) => {
                return roleService.updateRole(args);
            }
        ),

        deleteRole: checkPermission("delete-roles")(
            (_: unknown, args: DeleteRoleArgs) => {
                return roleService.deleteRole(args);
            }
        ),
    },

    Role: {
        permissions(parent: any) {
            if (parent.permissions) {
                return parent.permissions;
            }

            return parent.rolePermissions?.map((rp: any) => rp.permission) ?? [];
        },
    },
};

export default roleResolver;