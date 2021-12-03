const path = require("path");

class Nicer {
  common_excludes = [
    ".git",
    ".gitignore",
    ".vs-code",
    "package.json",
    "package-lock.json",
    "node_modules",
    "webpack*.js",
    "tailwind*.js",
    "nicer.config.js",
    path.basename(path.resolve()) + ".zip",
    path.basename(path.resolve()) + ".tar",
  ];
}

module.exports = new Nicer();
