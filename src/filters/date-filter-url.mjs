import { format } from "date-fns";

export default (value) => {
  const dateObject = new Date(value);
  return format(dateObject, "yyyy-MM-dd");
};
