export const isRequired = (value) => {
  return value !== undefined &&
    value !== null &&
    String(value).trim() !== "";
};

export const isEmail = (value) => {
  if (!value) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isPhone = (value) => {
  if (!value) return false;

  return /^[+]?[0-9\s()-]{7,20}$/.test(value);
};

export const minLength = (value, length) => {
  return String(value || "").length >= length;
};

export const maxLength = (value, length) => {
  return String(value || "").length <= length;
};

export const validateEmail = (value) => {
  if (!isRequired(value)) {
    return "Email is required";
  }

  if (!isEmail(value)) {
    return "Enter a valid email address";
  }

  return "";
};

export const validateRequired = (value, label = "This field") => {
  if (!isRequired(value)) {
    return `${label} is required`;
  }

  return "";
};