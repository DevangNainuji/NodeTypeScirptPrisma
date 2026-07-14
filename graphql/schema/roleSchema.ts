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
    getRoles(id: Int): [Role]
    getPermissions: [Permission!]
}

type Mutation {
    createRole(
        name: String!
        description: String
        permissionIDs: [Int!]!
    ): Role

    updateRole(
        id: Int!
        name: String!
        description: String
        permissionIDs: [Int!]!
    ): Role

    deleteRole(id: Int!): String
}
`;

export default roleSchema;