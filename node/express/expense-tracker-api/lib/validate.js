export const CATEGORIES = [
  "Groceries",
  "Leisure",
  "Electronics",
  "Utilities",
  "Clothing",
  "Health",
  "Others",
];

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export const validateRegister = (body) => {
  const errors = [];

  if (!isNonEmptyString(body?.name)) errors.push("name is required");
  if (!isNonEmptyString(body?.email)) {
    errors.push("email is required");
  } else if (!isEmail(body.email.trim())) {
    errors.push("email must be valid");
  }
  if (!isNonEmptyString(body?.password)) {
    errors.push("password is required");
  } else if (body.password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  return errors;
};

export const validateLogin = (body) => {
  const errors = [];

  if (!isNonEmptyString(body?.email)) errors.push("email is required");
  if (!isNonEmptyString(body?.password)) errors.push("password is required");

  return errors;
};

export const validateExpense = (body) => {
  const errors = [];

  if (!isNonEmptyString(body?.description)) errors.push("description is required");

  const amount = Number(body?.amount);
  if (body?.amount === undefined || body?.amount === null || body?.amount === "") {
    errors.push("amount is required");
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("amount must be a positive number");
  }

  if (!isNonEmptyString(body?.category)) {
    errors.push("category is required");
  } else if (!CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  }

  if (!isNonEmptyString(body?.date)) {
    errors.push("date is required");
  } else if (!isDate(body.date.trim())) {
    errors.push("date must be YYYY-MM-DD");
  }

  return errors;
};

export const validatePeriod = (period, startDate, endDate) => {
  const errors = [];
  if (!period) return errors;

  const valid = ["week", "month", "3months", "custom"];
  if (!valid.includes(period)) {
    errors.push(`period must be one of: ${valid.join(", ")}`);
    return errors;
  }

  if (period === "custom") {
    if (!isNonEmptyString(startDate)) errors.push("startDate is required for custom period");
    if (!isNonEmptyString(endDate)) errors.push("endDate is required for custom period");
    if (errors.length) return errors;

    if (!isDate(startDate.trim())) errors.push("startDate must be YYYY-MM-DD");
    if (!isDate(endDate.trim())) errors.push("endDate must be YYYY-MM-DD");
    if (errors.length) return errors;

    if (startDate > endDate) errors.push("startDate must not be after endDate");
  }

  return errors;
};
