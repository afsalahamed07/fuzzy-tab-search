import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  output: {
    filename: "content-script.js",
    path: __dirname,
  },
};
