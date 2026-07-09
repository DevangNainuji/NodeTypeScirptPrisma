const userSchema = `#graphql

type Role {
    id: ID!
    name: String!
}

type User {
    id: ID!
    name: String!
    email: String!
    role: Role
}

type Query {
    getUsers(id: ID): [User]
}

type Mutation {
    createUser(
        name: String!,
        email: String!,
        password: String!,
        confirmPassword: String!,
        roleId: ID!
    ): User

    updateUser(
        id: ID!,
        name: String!,
        email: String!,
        roleId: ID!
    ): User

    deleteUser(id: ID!): String
}
`;

export default userSchema;