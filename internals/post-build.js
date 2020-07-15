const fs = require("fs")
const path = require("path")
fs.copyFileSync(
  path.resolve(__dirname, "../src/index.html"),
  path.resolve(__dirname, "../dist/index.html")
)
