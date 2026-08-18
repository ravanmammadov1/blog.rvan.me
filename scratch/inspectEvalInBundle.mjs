import fs from "fs";
import path from "path";

const bundlePath = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\dist\\assets\\index-CJiXx1tx.js";
const content = fs.readFileSync(bundlePath, "utf8");

const evalRegex = /.{0,100}\beval\s*\(.{0,100}/g;
let m;
let count = 0;
while ((m = evalRegex.exec(content)) !== null && count < 10) {
  console.log(`Match ${++count}:`, m[0]);
}

const fnRegex = /.{0,100}\bnew\s+Function\s*\(.{0,100}/g;
let countFn = 0;
while ((m = fnRegex.exec(content)) !== null && countFn < 10) {
  console.log(`new Function Match ${++countFn}:`, m[0]);
}
