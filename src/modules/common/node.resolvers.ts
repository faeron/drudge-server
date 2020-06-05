import { globalIdField, fromGlobalId } from "../../common/graphql";
const modelsByTypename = {
  Account: "account",
};

export const resolvers = {
  Query: {
    node: async (root, args, context) => {
      const { __typename, id } = fromGlobalId(args.id);
      const Model = modelsByTypename[__typename];
      const node = await context[Model].getNode(id);

      console.log(node);

      return {
        ...node,
        __typename,
      };
    },
  },
  Account: {
    id: globalIdField("Account"),
  },
  Mutation: {
    signup: async (parent, args, context) => {
      return context.account.signup(args.account);
    },
  },
};
