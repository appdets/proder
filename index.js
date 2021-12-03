const path = require("path");

class Proder {
  common_excludes = [
    ".git",
    ".gitignore",
    ".vs-code",
    "package.json",
    "package-lock.json",
    "node_modules",
    "webpack*.js",
    "tailwind*.js",
    "proder.config.js",
    path.basename(path.resolve()) + ".zip",
    path.basename(path.resolve()) + ".tar",
  ];
}

module.exports = new Proder();
