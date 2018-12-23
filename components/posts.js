import * as registry from "./registry";

const posts = Object.keys(registry).map(k => registry[k]);

export default posts;
