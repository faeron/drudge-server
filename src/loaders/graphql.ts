import Router from "koa-router";
import koaPlayground from "graphql-playground-middleware-koa";
const graphqlHTTP = require("koa-graphql");
import { makeSchema } from "@nexus/schema";

import { AccountService } from "../modules/account/account.service";
import * as Account from "../modules/account/account.schema";
import * as scalars from "../modules/common/scalars.schema";
import * as node from "../modules/common/node.schema";

const router = new Router();

export default async ({ app, log }) => {
  const schema = makeSchema({ types: [scalars, node, Account] });

  const endpoint = "/graphql";

  // route for graphql api endpoint
  router.all(
    endpoint,
    graphqlHTTP(() => {
      return { schema, context: { account: new AccountService() } };
    })
  );

  //route for graphql playground
  router.all("/playground", koaPlayground({ endpoint }) as any);

  app.use(router.routes());
};
