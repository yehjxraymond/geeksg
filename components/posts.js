import { sortBy } from "lodash";
import * as registry from "./registry";

const posts = sortBy(
  Object.keys(registry).map(k => registry[k]),
  "date"
).reverse();

export default posts;
