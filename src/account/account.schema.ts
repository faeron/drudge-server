import { objectType } from "@nexus/schema";

export const Account = objectType({
  name: "Account",
  definition(t) {
    t.implements("Node");
    t.string("email");
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
    t.field("lastLoginAt", { type: "DateTime" });
  },
});
