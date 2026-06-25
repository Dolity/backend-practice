export const DURATIONS = ["day", "week", "month", "year"];

export const validateDuration = (duration) => {
  const errors = [];
  if (!DURATIONS.includes(duration)) {
    errors.push(`duration must be one of: ${DURATIONS.join(", ")}`);
  }
  return errors;
};

export const validateLimit = (limit) => {
  const errors = [];
  const n = Number(limit);
  if (!Number.isInteger(n) || n < 1) {
    errors.push("limit must be a positive integer");
  } else if (n > 100) {
    errors.push("limit must not exceed 100");
  }
  return errors;
};
