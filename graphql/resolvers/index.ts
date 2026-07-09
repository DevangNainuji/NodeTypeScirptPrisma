import authResolver from "./authResolver.js";
import roleResolver from "./roleResolver.js";
import userResolver from "./userResolver.js";

const resolvers = {
    Query: {
        ...userResolver.Query,
        ...roleResolver.Query,
    },

    Mutation: {
        ...userResolver.Mutation,
        ...authResolver.Mutation,
        ...roleResolver.Mutation,
    },
};

export default resolvers;