#! /usr/bin/env node
const commandLineArgs = require("command-line-args");
const chalk = require("chalk");
const path = require("path");
const Nicer = require("./../nicer/nicer");
const { error, success } = require("../nicer/nicer-fn");
const fs = require("fs");
const { rm } = require("fs/promises");
const commandLineUsage = require("command-line-usage");

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
        content: chalk.blue(`
 ███▄    █  ██▓ ▄████▄  ▓█████  ██▀███  
 ██ ▀█   █ ▓██▒▒██▀ ▀█  ▓█   ▀ ▓██ ▒ ██▒
▓██  ▀█ ██▒▒██▒▒▓█    ▄ ▒███   ▓██ ░▄█ ▒
▓██▒  ▐▌██▒░██░▒▓▓▄ ▄██▒▒▓█  ▄ ▒██▀▀█▄  
▒██░   ▓██░░██░▒ ▓███▀ ░░▒████▒░██▓ ▒██▒
░ ▒░   ▒ ▒ ░▓  ░ ░▒ ▒  ░░░ ▒░ ░░ ▒▓ ░▒▓░
░ ░░   ░ ▒░ ▒ ░  ░  ▒    ░ ░  ░  ░▒ ░ ▒░
   ░   ░ ░  ▒ ░░           ░     ░░   ░ js
         ░  ░  ░ ░         ░  ░   ░     
               ░                        
`),
      },
      {
        header:
          "NicerJS " +
          require(path.join(__dirname, "./../package.json")).version,
        content: `{bold NicerJS} is a tiny devOps tools used for building production version of development directory ${chalk.red(
          "S"
        )} ${chalk.green("M")} ${chalk.blue("A")} ${chalk.yellow(
          "R"
        )} ${chalk.cyan("L")} ${chalk.white("Y")}
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
            description: `Run NicerJS with root nicer.json or default configuration
              `,
          },
          {
            name: "init",
            alias: "i",
            typeLabel: " ",
            description: `Create default {bold {italic nicer.json}} in the root directory of work tree
              `,
          },
          {
            name: "build",
            alias: "b",
            typeLabel: " ",
            description: `Run NicerJS with root {bold nicer.json} or default configuration. {bold --build=myDir} will copy directory into {bold myDir} directory
              `,
          },
          {
            name: "config",
            alias: "c",
            typeLabel: " ",
            description: `Configuration JSON file path relative to ROOT directory 
              Example: {bold nicer -c=/path/to/json}
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
        content: `{bold Developed by Jafran Hasan}
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
      chalk.yellow(require(path.join(__dirname, "./../package.json")).version)
    );
  }

  loadConfig(configFilePath = "./nicer.json") {
    if (fs.existsSync(path.resolve(configFilePath))) {
      let customconfig = require(path.resolve(configFilePath));
      return Object.assign(Nicer.defaultConfig(), customconfig);
    }
    return false;
  }

  async initNicerConfig(args) {
    if ("force" in args) {
      await rm(path.resolve("nicer.json"));
    }
    if (!fs.existsSync(path.resolve("nicer.json"))) {
      fs.appendFile(
        path.resolve("nicer.json"),
        JSON.stringify(Nicer.defaultConfig()),
        () => {
          return true;
        }
      );

      success("✅ Nicer Initialized");
    }
    return true;
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
      config = this.loadConfig("./nicer.json");
      if (!config) {
        config = Nicer.defaultConfig();
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

    Nicer.init(config);
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
