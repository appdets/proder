const chalk = require("chalk");

const NicerFunctions = {
  message(color = "other", text) {
    let args = Object.values(arguments).filter((arg, i) => i > 0);
    args = args.map((arg) => {
      if (typeof arg != "object") return `${chalk[color](arg)}`;
      else return arg;
    });

    console.log(...args, ``);
  },
  warning(...text) {
    NicerFunctions.message("yellow", ...text);
  },
  error(...text) {
    NicerFunctions.message("red", ...text);
  },
  info(...text) {
    NicerFunctions.message("blue", ...text);
  },
  success(...text) {
    NicerFunctions.message("green", ...text);
  },
};

module.exports = NicerFunctions;
