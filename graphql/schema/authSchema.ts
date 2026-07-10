const authSchema = `#graphql

type AuthUser {
    id: ID!
    name: String!
    email: String!
}

type AuthResponse {
    success: Boolean!
    message: String!
    user: AuthUser
    isSuperAdmin: Boolean
    permissions: [String!]!
}

type Mutation {
    login(email: String!, password: String!): AuthResponse

    refreshToken: AuthResponse
    
    logout: String
}
    
`;

export default authSchema;