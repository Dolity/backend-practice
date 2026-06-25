export const TYPES = ["playing", "popular", "top", "upcoming"];

export const validateType = (type) => {
  const errors = [];
  if (!type) {
    errors.push("type is required");
    return errors;
  }
  if (!TYPES.includes(type)) {
    errors.push(`type must be one of: ${TYPES.join(", ")}`);
  }
  return errors;
};
