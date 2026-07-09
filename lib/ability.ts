import { AbilityBuilder, createMongoAbility, } from "@casl/ability";

export const defineAbility = (permissions: string[], isSuperAdmin: boolean) => {

    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (isSuperAdmin) {
        can("manage", "all");
        return build();
    }

    permissions.forEach(permission => {
        can(permission, "all");
    });

    return build();
};