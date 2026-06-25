const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

export const validatePost = (body) => {
  const errors = [];

  if (!isNonEmptyString(body?.title)) errors.push("title is required");
  if (!isNonEmptyString(body?.content)) errors.push("content is required");
  if (!isNonEmptyString(body?.category)) errors.push("category is required");

  if (!Array.isArray(body?.tags)) {
    errors.push("tags must be an array");
  } else if (body.tags.some((t) => typeof t !== "string")) {
    errors.push("each tag must be a string");
  }

  return errors;
};
