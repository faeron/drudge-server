import { globalIdField } from "../../common/graphql";

export const resolvers = {
  Account: {
    id: globalIdField("Account"),
  },
  Mutation: {
    signup: async (parent, args, context) => {
      return context.account.signup(args.account);
    },
  },
};
