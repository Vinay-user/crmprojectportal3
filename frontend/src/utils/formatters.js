export const formatStatus = (value = "") => {
  if (!value) return "";

  return value
    .toString()
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatCurrency = (value, currency = "USD") => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
};

export const formatNumber = (value) => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-US").format(number);
};

export const truncate = (text = "", length = 60) => {
  if (!text) return "";

  return text.length > length
    ? `${text.slice(0, length)}...`
    : text;
};

export const initials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};
