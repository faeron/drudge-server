import { globalIdField } from "../../common/graphql";

export const resolvers = {
  Account: {
    id: globalIdField("Account"),
  },
  Mutation: {
    signup: async (root, { input }, context) => {
      const createdAccount = await context.account.signup(input);
      return { account: createdAccount };
    },
  },
};
