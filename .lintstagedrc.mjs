import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(" --file ")}`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(" ")}`;

const rules = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  ["*.{js,jsx,ts,tsx,json,css,scss,md}"]: [buildPrettierCommand],
};

export default rules;
