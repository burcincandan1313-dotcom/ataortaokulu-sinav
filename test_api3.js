
import fs from "fs";
let code = fs.readFileSync("src/api.js", "utf-8");
code = code.replace("if (res1 && res1.ok)", "console.log(\"RES1: \", await res1.clone().text().catch(e=>null)); if (res1 && res1.ok)");
code = code.replace("if (res2 && res2.ok)", "console.log(\"RES2: \", await res2.clone().text().catch(e=>null)); if (res2 && res2.ok)");
code = code.replace("if (res3 && res3.ok)", "console.log(\"RES3: \", await res3.clone().text().catch(e=>null)); if (res3 && res3.ok)");
code = code.replace("if (res4 && res4.ok)", "console.log(\"RES4: \", await res4.clone().text().catch(e=>null)); if (res4 && res4.ok)");
code = code.replace("if (res5 && res5.ok)", "console.log(\"RES5: \", await res5.clone().text().catch(e=>null)); if (res5 && res5.ok)");
fs.writeFileSync("src/api_test.js", code);

