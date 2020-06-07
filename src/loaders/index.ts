import mongooseLoader from "./mongoose";
import koaLoader from "./koa";
import graphqlLoader from "./graphql";

export default async ({ app, log }) => {
  await mongooseLoader();
  log.info("MongoDB loaded");

  await koaLoader({ app, log });
  log.info("koa endpoints loaded");

  await graphqlLoader({ app, log });
  log.info("GraphQL endpoint loaded");
};
