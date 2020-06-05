import { GraphQLDate, GraphQLTime, GraphQLDateTime } from "graphql-iso-date";

export const resolvers = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
};
