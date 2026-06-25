const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

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

export const validateTodo = (body) => {
  const errors = [];

  if (!isNonEmptyString(body?.title)) errors.push("title is required");
  if (!isNonEmptyString(body?.description)) errors.push("description is required");

  return errors;
};
