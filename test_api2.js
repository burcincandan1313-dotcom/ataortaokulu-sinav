
import fs from "fs";
let code = fs.readFileSync("src/api.js", "utf-8");
code = code.replace("if (c === '??') {", "console.log(\"CLEAN RECEIVED:\", t.substring(0, 50)); if (c === '??') {");
fs.writeFileSync("src/api.js", code);

