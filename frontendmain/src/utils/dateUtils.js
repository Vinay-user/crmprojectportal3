import {
  format,
  parseISO,
  isValid
} from "date-fns";

export const formatDate = (
  value,
  pattern = "MMM dd, yyyy"
) => {
  if (!value) return "-";

  const date =
    typeof value === "string"
      ? parseISO(value)
      : new Date(value);

  if (!isValid(date)) return "-";

  return format(date, pattern);
};

export const formatDateTime = (value) => {
  return formatDate(value, "MMM dd, yyyy hh:mm a");
};

export const today = () => {
  return format(new Date(), "yyyy-MM-dd");
};