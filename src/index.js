#!/usr/bin/env node

const args = require("docopt").docopt(
  `
Usage:
  leopkg <package>... [options]
Options:
  -h --help   Show this screen.
  -d --debug  Debug mode.
`.trim()
);

const spawn = require("./spawn");
const tmp = require("tmp");
tmp.setGracefulCleanup();

(async () => {
  for (const name of args["<package>"]) {
    const cwd = tmp.dirSync().name;
    process.chdir(cwd);

    const gitCommands = [
      ["git", "clone", `https://github.com/leobastiani/${name}`, cwd],
    ];

    const commands = [
      ...gitCommands,
      ["choco", "install", "-y", "-s", ".", name],
    ];

    for (const command of commands) {
      const [head, ...tail] = command;
      const exitCode = await spawn(head, tail);
      if (exitCode !== 0) {
        process.exit(exitCode);
      }
    }
  }
})();
