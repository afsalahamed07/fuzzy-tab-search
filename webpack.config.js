import * as path from "path";

import { fileURLToPath } from "url";

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.js",
  devtool: "inline-source-map",
  output: {
    filename: "content-script.js",
    path: __dirname,
  },
};
