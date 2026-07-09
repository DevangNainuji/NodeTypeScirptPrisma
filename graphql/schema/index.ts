import authSchema from "./authSchema.js";
import roleSchema from "./roleSchema.js";
import userSchema from "./userSchema.js";

const typeDefs = `#graphql
    ${userSchema}
    ${authSchema}
    ${roleSchema}
`;

export default typeDefs;