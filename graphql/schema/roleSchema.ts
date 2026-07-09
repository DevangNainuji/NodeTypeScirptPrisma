const roleSchema = `#graphql

type Permission {
    id: ID!
    module: String!
    name: String!
    slug: String!
}

type Role {
    id: ID!
    name: String!
    slug: String!
    description: String
    permissions: [Permission!]!
}

type Query {
    getRoles(id: ID): [Role]
    getPermissions: [Permission!]
}

type Mutation {
    createRole(
        name: String!
        description: String
        permissionIDs: [ID!]!
    ): Role

    updateRole(
        id: ID!
        name: String!
        description: String
        permissionIDs: [ID!]!
    ): Role

    deleteRole(id: ID!): String
}
`;

export default roleSchema;