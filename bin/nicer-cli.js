#! /usr/bin/env node
const commandLineArgs = require("command-line-args");
const chalk = require("chalk");
const path = require("path");
const NicerCore = require("./../nicer/nicer");
const { error, success } = require("../nicer/nicer-fn");
const fs = require("fs");
const { rm } = require("fs/promises");
const commandLineUsage = require("command-line-usage");
const { common_excludes } = require("..");

class NicerCLI {
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
          "NicerJS v" +
          require(path.join(__dirname, "./../package.json")).version,
      },
      {
        content: chalk.yellow(`
    #     #   ###    #####   ######   ######       ###   #####   
    # #   #    #    #        #        #    #         #   #      
    #  #  #    #    #        #####    ######         #   #####  
    #   # #    #    #        #        #   #     #    #       #  
    #     #   ###    #####   ######   #     #    ####    #####  
`),
      },
      {
        content: `{bold NicerJS} is a tiny devOps tools, builds production version of development directory {bold {yellow N} {red I} {green C} {blue L} {grey Y}}. Let it be done for you now.
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
            description: `Run NicerJS with root nicer.config.js or default configuration
              `,
          },
          {
            name: "init",
            alias: "i",
            typeLabel: " ",
            description: `Create default {bold {italic nicer.config.js}} in the root directory of work tree
              `,
          },
          {
            name: "build",
            alias: "b",
            typeLabel: " ",
            description: `Run NicerJS with root {bold nicer.config.js} or default configuration. {bold --build=myDir} will copy directory into {bold myDir} directory
              `,
          },
          {
            name: "config",
            alias: "c",
            typeLabel: " ",
            description: `Configuration file path relative to ROOT directory 
              Example: {bold nicer -c=/path/to/config}
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
            description: `Make the command forcefully. Only works with nicer --init
            `,
          },
        ],
      },
      {
        content: `{bold Nicely developed by {yellow Jafran Hasan}}
        Me on Facebook https://fb.com/IamJafran
        Send bugs and report at jafraaan@gmail.com`,
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

  loadConfig(configFilePath = "./nicer.config.js") {
    if (fs.existsSync(path.resolve(configFilePath))) {
      let customconfig = require(path.resolve(configFilePath));
      return Object.assign(NicerCore.defaultConfig(), customconfig);
    }
    return false;
  }

  async initNicerConfig(args) {
    if ("force" in args && fs.existsSync(path.resolve("nicer.config.js"))) {
      fs.rmSync(path.resolve("nicer.config.js"));
    }
    if (!fs.existsSync(path.resolve("nicer.config.js"))) {
      const content = NicerCore.defaultConfig();

      fs.appendFileSync(
        path.resolve("nicer.config.js"),
        `module.exports = ` + JSON.stringify(content, undefined, 2),
        () => {
          return true;
        }
      );

      return success(
        `\n✅ ${chalk.italic(
          `Created ${chalk.yellow.bold(`nicer.config.js`)}`
        )}\n`
      );
    }

    return console.log(
      `\n🚫 ${chalk.italic.yellow(
        `NicerJS configuration file exists!`
      )} \nRun ${chalk.bold.yellow("nicer -i -f")} to override\n`
    );
  }

  async buildNicer(args) {
    var config = {};

    const configFilePath =
      "config" in args && args.config ? args.config : false;

    if (configFilePath) {
      config = this.loadConfig(configFilePath);
      if (!config)
        return error(`Configuration file ${chalk.bold(path)} doesn't exist`);
    } else {
      config = this.loadConfig("./nicer.config.js");
      if (!config) {
        config = NicerCore.defaultConfig();
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

    console.log(config);
    // NicerCore.init(config);
  }

  async route(args) {
    switch (true) {
      case "version" in args:
        this.showVersion();
        break;
      case "init" in args:
        this.initNicerConfig(args);
        break;
      case "build" in args:
        this.buildNicer(args);
        break;
      default:
      case "help" in args:
        this.showHelp();
        break;
    }
  }
}

new NicerCLI().init();
