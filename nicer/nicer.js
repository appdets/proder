const fs = require("fs");
const path = require("path");
const { mkdir, readdir, copyFile, lstat } = require("fs/promises");
const { zip, tar } = require("zip-a-folder");
const glob = require("glob");
const { error, success, warning, info } = require("./nicer-fn");

class Nicer {
  config = false;

  defaultConfig() {
    return {
      src: "test",
      build: "build",
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
  async exists() {}

  getFullExcludeList() {
    if (!this.config.exclude || this.config.exclude.length == 0) return false;
    return this.config.exclude.map((exclud) => {
      return path.resolve(".nier" + this.path(exclud));
    });
  }

  async copyDir(src, dest) {
    await mkdir(path.join(dest), { recursive: true });

    let entries = await readdir(src, { withFileTypes: true });
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
            );
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

    return await this.copyDir(
      path.resolve(this.config.src),
      path.resolve(".nicer")
    );
  }

  path(filepath) {
    if (!filepath.startsWith("/")) filepath = "/" + filepath;
    return filepath;
  }

  async excludeList() {
    try {
      if (this.config.exclude && this.config.exclude.length > 0) {
        this.config.exclude.forEach((exclude) => {
          glob(`.nicer${this.path(exclude)}`, {}, async (err, files) => {
            if (files && files.length > 0) {
              files.forEach(async (file) => {
                fs.rmSync(file, { recursive: true });
              });
            }
          });
        });

        return true;
      }
    } catch (e) {
      return false;
    }
  }
  async moveList() {
    try {
      if (this.config.move && this.config.move.length > 0) {
        this.config.move.forEach((moveItem) => {
          let moveFrom = `.nicer${this.path(moveItem[0])}`,
            moveTo = `.nicer${this.path(moveItem[1])}`;
          glob(moveFrom, {}, (err, files) => {
            if (files && files.length > 0) {
              files.forEach((file) => {
                fs.rename(file, moveTo, function (err) {
                  if (err) throw err;
                });
              });

              return true;
            }
          });
        });

        return true;
      }
    } catch (e) {
      return false;
    }
  }
  async compress() { 
    if (this.config.compress) {
      let compressed = false;
      if (this.config.compress.extension === "zip") {
        compressed = await zip(".nicer", this.config.build + ".zip", {
          level: this.config.compress.level || "high",
        });
      } else {
        compressed = await zip(".nicer", this.config.build + ".tar", {
          level: this.config.compress.level,
        });
      }

      try {
        fs.rmSync(".nicer", { recursive: true });
      } catch (e) {}

      return true;
    }
    return false;
  }

  async moveToBuild() {
    try {
      fs.renameSync(path.resolve(".nicer"), path.resolve(this.config.build));
    } catch (e) {
      return false;
    }
    return true;
  }

  async init(config) {
    this.config = config;

    await this.before();

    await this.copySrc();

    await this.excludeList();

    await this.moveList();

    await this.compress();

    await this.after();
  }
  async before() {}
  async after() {}
}

module.exports = new Nicer();
