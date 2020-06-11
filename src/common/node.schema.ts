import { interfaceType, queryField, idArg } from "@nexus/schema";

export function toGlobalId(__typename, id) {
  return Buffer.from(`${__typename}:${id}`, "utf8").toString("base64");
}

export function fromGlobalId(objectId) {
  const decoded = Buffer.from(objectId, "base64").toString("utf8");
  const [__typename, id] = decoded.split(":");
  return {
    id,
    __typename,
  };
}

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", {
      async resolve(obj, args, context, info) {
        return toGlobalId(info.parentType.name, obj.id);
      },
    });
    t.resolveType((obj, context, info) => {
      return obj.__typename;
    });
  },
});

const modelsByTypename = {
  Account: "account",
};

export const node = queryField("node", {
  type: Node,
  nullable: true,
  args: {
    id: idArg({ required: true }),
  },
  async resolve(_, { id: globalId }, context) {
    const { __typename, id } = fromGlobalId(globalId);
    if (!__typename || !id) {
      return null;
    }
    // determine which model/datasource can fetch the node by type
    const dataSource = modelsByTypename[__typename];
    const node = await context[dataSource].getById(id);
    if (!node) {
      return null;
    }
    //
    return { ...node, __typename };
  },
});
