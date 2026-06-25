export const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

export const validatePort = (port) => {
  const errors = [];
  if (port === undefined) {
    errors.push("--port is required when starting the server");
    return errors;
  }
  const n = Number(port);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    errors.push("port must be an integer between 1 and 65535");
  }
  return errors;
};

export const validateOrigin = (origin) => {
  const errors = [];
  if (origin === undefined) {
    errors.push("--origin is required when starting the server");
    return errors;
  }
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      errors.push("origin must use http: or https:");
    }
  } catch {
    errors.push("origin must be a valid URL");
  }
  return errors;
};
