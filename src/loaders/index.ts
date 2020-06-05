import mongooseLoader from "./mongoose";
import graphqlLoader from "./graphql";

export default async ({ app, log }) => {
  await mongooseLoader();
  log.info("MongoDB loaded");

  await graphqlLoader({ app, log });
  log.info("GraphQL endpoint loaded");
};
