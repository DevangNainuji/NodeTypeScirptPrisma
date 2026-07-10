const authSchema = `#graphql

type AuthUser {
    id: ID!
    name: String!
    email: String!
    isSuperAdmin: Boolean
    permissions: [String!]!
}

type AuthResponse {
    success: Boolean!
    message: String!
    user: AuthUser
}

type Mutation {
    login(email: String!, password: String!): AuthResponse

    refreshToken: AuthResponse
    
    logout: String
}
    
`;

export default authSchema;