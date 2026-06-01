export const generateSlug = (businessName) => {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};
 