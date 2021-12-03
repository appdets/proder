const { common_excludes } = require("./index")

module.exports = {
  build: "test",
  compress: 0,
  exclude: [...common_excludes],
};