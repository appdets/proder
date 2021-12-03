const chalk = require("chalk");

const ProderFunctions = {
  message(color = "other", text) {
    let args = Object.values(arguments).filter((arg, i) => i > 0);
    args = args.map((arg) => {
      if (typeof arg != "object") return `${chalk[color](arg)}`;
      else return arg;
    });

    console.log(...args, ``);
  },
  warning(...text) {
    ProderFunctions.message("yellow", ...text);
  },
  error(...text) {
    ProderFunctions.message("red", ...text);
  },
  info(...text) {
    ProderFunctions.message("blue", ...text);
  },
  success(...text) {
    ProderFunctions.message("green", ...text);
  },
};

module.exports = ProderFunctions;
