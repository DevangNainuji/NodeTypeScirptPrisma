import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import typeDefs from "./graphql/schema/index.js";
import resolvers from "./graphql/resolvers/index.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { env } from "./utils/env.js";

const host: string = env.APP_HOST;
const port: number = env.APP_PORT;
const frontendUrl: string = env.FRONTEND_URL;

async function startServer(): Promise<void> {
    const app: Express = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(cookieParser());

    app.use(
        "/graphql",
        cors({
            origin: frontendUrl,
            credentials: true,
        }),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                const user = await authMiddleware(req);
                return {
                    req,
                    res,
                    user,
                };
            }
        })
    );

    app.listen(port, () => {
        console.log(`🚀 Server running at http://${host}:${port}/graphql`);
    });
};

startServer().catch((error: Error) => {
    console.error("Failed to start server:", error);
});