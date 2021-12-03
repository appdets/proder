#! /usr/bin/env node
const commandLineArgs = require("command-line-args");
const chalk = require("chalk");
const path = require("path");
const ProderCore = require("../proder/proder");
const { error, success } = require("../proder/proder-fn");
const fs = require("fs"); 
const commandLineUsage = require("command-line-usage"); 

class ProderCLI {
  optionDefinitions() {
    return [
      { name: "build", alias: "b", type: Boolean, default: true },
      { name: "version", alias: "v", type: Boolean, default: true },
      { name: "config", alias: "c", default: "" },
      { name: "help", alias: "h", type: Boolean, default: true },
      { name: "compress", alias: "z", type: String, default: "zip" },
      { name: "level", alias: "l", type: String, default: "high" },
      { name: "init", alias: "i", type: Boolean },
      { name: "force", alias: "f", type: Boolean, default: true },
    ];
  }

  showHelp() {
    const sections = [
      {
        header:
          "Proder v" +
          require(path.join(__dirname, "./../package.json")).version,
      },
      {
        content: chalk.yellow(`
██████  ██████   ██████  ██████  ███████ ██████  
██   ██ ██   ██ ██    ██ ██   ██ ██      ██   ██ 
██████  ██████  ██    ██ ██   ██ █████   ██████  
██      ██   ██ ██    ██ ██   ██ ██      ██   ██ 
██      ██   ██  ██████  ██████  ███████ ██   ██                                       
`),
      },
      {
        content: `{bold Proder} is a tiny devOps tools, builds production version of development directory {bold {yellow N} {red I} {green C} {blue L} {grey Y}}. Let it be done for you now.
          `,
      },
      {
        header: "Commands",
        optionList: [
          {
            name: "help",
            alias: "h",
            typeLabel: " ",
            description: `Shows this help instruction messages
            `,
          },
          {
            name: "version",
            alias: "v",
            typeLabel: " ",
            description: `Run Proder with root proder.config.js or default configuration
              `,
          },
          {
            name: "init",
            alias: "i",
            typeLabel: " ",
            description: `Create default {bold {italic proder.config.js}} in the root directory of work tree
              `,
          },
          {
            name: "build",
            alias: "b",
            typeLabel: " ",
            description: `Run Proder with root {bold proder.config.js} or default configuration. {bold --build=myDir} will copy directory into {bold myDir} directory
              `,
          },
          {
            name: "config",
            alias: "c",
            typeLabel: " ",
            description: `Configuration file path relative to ROOT directory 
              Example: {bold proder -c=/path/to/config}
              `,
          },
          {
            name: "compress",
            typeLabel: "{underline false | zip | tar}",
            description: `Compresses directory into zip. Default is false
            `,
          },
          {
            name: "force",
            alias: "f",
            typeLabel: " ",
            description: `Make the command forcefully. Only works with proder --init
            `,
          },
        ],
      },
      {
        content: `{bold Made with {red ♥} by    Jafran Hasan}
        {bold Me on Facebook}    https://fb.com/IamJafran
        {bold Send bugs and     report at} jafraaan@gmail.com`,
      },
    ];
    const usage = commandLineUsage(sections);
    console.log(usage);
  }

  init() {
    try {
      this.args = commandLineArgs(this.optionDefinitions());
    } catch (e) {
      return this.showHelp();
    }
    this.route(this.args);
  }

  showVersion() {
    console.log(
      chalk.yellow('v'  + require(path.join(__dirname, "./../package.json")).version)
    );
  }

  loadConfig(configFilePath = "./proder.config.js") {
    if (fs.existsSync(path.resolve(configFilePath))) {
      let customconfig = require(path.resolve(configFilePath));
      return Object.assign(ProderCore.defaultConfig(), customconfig);
    }
    return false;
  }

  async initProderConfig(args) {
    if ("force" in args && fs.existsSync(path.resolve("proder.config.js"))) {
      fs.rmSync(path.resolve("proder.config.js"));
    }
    if (!fs.existsSync(path.resolve("proder.config.js"))) {
      const content = ProderCore.defaultConfig();

      fs.appendFileSync(
        path.resolve("proder.config.js"),
        `module.exports = ` + JSON.stringify(content, undefined, 2),
        () => {
          return true;
        }
      );

      return success(
        `\n✅ ${chalk.italic(
          `Created ${chalk.yellow.bold(`proder.config.js`)}`
        )}\n`
      );
    }

    return console.log(
      `\n🚫 ${chalk.italic.yellow(
        `Proder configuration file exists!`
      )} \nRun ${chalk.bold.yellow("proder -i -f")} to override\n`
    );
  }

  async buildProduction(args) {
    var config = {};

    const configFilePath =
      "config" in args && args.config ? args.config : false;

    if (configFilePath) {
      config = this.loadConfig(configFilePath);
      if (!config)
        return error(`Configuration file ${chalk.bold(path)} doesn't exist`);
    } else {
      config = this.loadConfig("./proder.config.js");
      if (!config) {
        config = ProderCore.defaultConfig();
      }
    }

    // overriding configs
    if ("compress" in args) {
      let extension =
        args.compress != "0" && args.compress != "false" && args.compress != ""
          ? args.compress == "tar"
            ? "tar"
            : "zip"
          : false;

      if (extension) {
        if (typeof config.compress != "object") config.compress = {};
        config.compress.extension = extension;
        config.compress.level =
          "level" in args && args.level != "" ? args.level : "high";
      }
    }
 
    ProderCore.init(config);
  }

  async route(args) {
    switch (true) {
      case "version" in args:
        this.showVersion();
        break;
      case "init" in args:
        this.initProderConfig(args);
        break;
      case "build" in args:
        this.buildProduction(args);
        break;
      default:
      case "help" in args:
        this.showHelp();
        break;
    }
  }
}

new ProderCLI().init();
