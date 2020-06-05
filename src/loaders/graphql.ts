import Router from "koa-router";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import koaPlayground from "graphql-playground-middleware-koa";
const graphqlHTTP = require("koa-graphql");
import { AccountService } from "../modules/account/account.service";

const router = new Router();

export default async ({ app, log }) => {
  const typeDefs = mergeTypeDefs(loadFilesSync("./**.graphql"));
  const resolvers = mergeResolvers(loadFilesSync("./**/*.resolvers.ts"));
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const endpoint = "/graphql";

  // route for graphql api endpoint
  router.all(
    endpoint,
    graphqlHTTP(() => {
      return { schema, context: { account: new AccountService() } };
    })
  );

  //route for graphql playground
  router.all("/playground", koaPlayground({ endpoint }));

  app.use(router.routes());
};
