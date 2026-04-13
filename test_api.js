
import fs from "fs";
import { askAI } from "./src/api.js";
(async() => {
  const r = await askAI("merhaba");
  console.log("merhaba =>", r.substring(0, 50));
})();

