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
    getUsers(id: Int): [User]
}

type Mutation {
    createUser(
        name: String!,
        email: String!,
        password: String!,
        confirmPassword: String!,
        roleId: Int!
    ): User

    updateUser(
        id: Int!,   
        name: String!,
        email: String!,
        roleId: Int!
    ): User

    deleteUser(id: Int!): String
}
`;

export default userSchema;