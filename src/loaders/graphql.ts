import Router from "@koa/router";
import koaPlayground from "graphql-playground-middleware-koa";
const graphqlHTTP = require("koa-graphql");
import { makeSchema } from "@nexus/schema";

import { AccountService } from "../account/account.service";
import { graphqlTypes as commonTypes } from "../common";
import { graphqlTypes as accountTypes } from "../account";

const router = new Router();

export default async ({ app, log }) => {
  // create graphql schema from all collected types
  const schema = makeSchema({ types: [commonTypes, accountTypes] });

  // graphql endpoint URI
  const endpointURI = "/graphql";

  // create the graphql context per request
  const createContext = () => ({ account: new AccountService() });

  // add route for graphql api endpoint
  router.all(
    endpointURI,
    graphqlHTTP(() => {
      return { schema, context: createContext() };
    })
  );

  // add route for graphql playground
  router.all("/playground", koaPlayground({ endpoint: endpointURI }) as any);

  app.use(router.routes());
};
