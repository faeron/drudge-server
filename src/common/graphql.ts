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

export const globalIdField = (typeName, idFetcher?) => ({
  description: "The ID of an object",
  resolve: (obj, args, context, info) => toGlobalId(typeName || info.parentType.name, idFetcher ? idFetcher(obj, context, info) : obj.id),
});
