const fs = require("fs");
const path = require("path");
const { copyFile } = require("fs/promises");
const { zip, tar } = require("zip-a-folder");
const glob = require("glob");
const { error, success, info } = require("./nicer-fn");
const chalk = require("chalk");

class NicerCore {
  config = false;

  defaultConfig() {
    return {
      src: "",
      build: path.basename(path.resolve()),
      compress: {
        extension: "zip",
        level: "high",
      },
      move: [],
      exclude: [],
    };
  }
  async getConfig() {
    return this.config || this.defaultConfig();
  }

  getFullExcludeList() {
    if (!this.config.exclude || this.config.exclude.length == 0) return false;
    return this.config.exclude.map((exclud) => {
      return path.resolve(".nier" + this.path(exclud));
    });
  }

  async copyDir(src, dest) {
    fs.mkdirSync(path.join(dest), { recursive: true });

    let entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      if (this.config.exclude) {
        let isExcludable = false;
        this.config.exclude.map((exclud) => {
          isExcludable =
            new RegExp(path.resolve(this.config.src + exclud)).test(srcPath) ||
            new RegExp(path.resolve(this.config.src + exclud + "/*")).test(
              srcPath
            ) ||
            path
              .resolve(this.config.src + srcPath)
              .startsWith(path.resolve(this.config.src + exclud));
        });

        if (isExcludable) continue;
      }

      if (entry.name == ".nicer") continue;

      entry.isDirectory()
        ? await this.copyDir(srcPath, destPath)
        : await copyFile(srcPath, destPath);
    }

    return dest;
  }

  async copySrc() {
    try {
      fs.rmSync(".nicer", { recursive: true });
    } catch (e) {}

    try {
      return await this.copyDir(
        path.resolve(this.config.src),
        path.resolve(".nicer")
      );
    } catch (e) {
      error("Directory error!");
      return;
    }
  }

  path(filepath) {
    if (!filepath.startsWith("/")) filepath = "/" + filepath;
    return filepath;
  }

  async excludeList() {
    try {
      this.config.exclude.forEach(async (exclude) => {
        let files = glob.sync(`.nicer${this.path(exclude)}`);

        if (files && files.length > 0) {
          files.forEach((file) => {
            fs.rmSync(file, { recursive: true });
          });

          return true;
        }
      });
    } catch (e) {
      return false;
    }
  }
  async moveList() {
    try {
      this.config.move.forEach(async (moveItem) => {
        let moveFrom = `.nicer${this.path(moveItem[0])}`,
          moveTo = `.nicer${this.path(moveItem[1])}`;

        let files = glob.sync(moveFrom);

        if (files && files.length > 0) {
          files.forEach((file) => {
            fs.renameSync(file, moveTo, function (err) {
              if (err) throw err;
            });
          });

          return true;
        }
      });
    } catch (e) {
      return false;
    }
  }
  async compress() {
    if (!this.config.compress) return false;
    let compressed = false;

    try {
      if (
        this.config.compress.extension &&
        this.config.compress.extension === "tar"
      ) {
        compressed = await tar(".nicer", this.config.build + ".tar", {
          level: this.config.compress.level || "high",
        });
      } else {
        compressed = await zip(".nicer", this.config.build + ".zip", {
          level: this.config.compress.level,
        });
      }

      fs.rmSync(".nicer", { recursive: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  async moveToBuild() {
    if (this.config.compress) return;
    try {
      if (fs.existsSync(path.resolve(this.config.build))) {
        fs.rmSync(path.resolve(this.config.build), { recursive: true });
      }

      return fs.renameSync(
        path.resolve(".nicer"),
        path.resolve(this.config.build),
        {
          recursive: true,
        }
      );
    } catch (e) {
      error(e);
      return false;
    }
  }

  async init(config) {
    this.config = config;

    await this.before();

    try {
      await this.copySrc();
    } catch (e) {
      error(e);
      return;
    }

    if (config.exclude && config.exclude.length > 0) await this.excludeList();

    if (config.move && config.move.length > 0) await this.moveList();

    await this.moveToBuild();

    await this.compress();

    await this.after();
  }
  async before() {}
  async after() {
    success(
      `\n✅ Built to ` +
        chalk.yellow.bold(
          this.config.compress
            ? this.config.build +
                "." +
                (this.config.compress.extension || "zip")
            : this.config.build
        ) +
        "\n"
    );
  }
}

module.exports = new NicerCore();
