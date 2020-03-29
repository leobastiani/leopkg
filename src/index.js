#!/usr/bin/env node

const args = require('docopt').docopt(
  `
Usage:
  leopkg <package>... [options]
Options:
  -h --help   Show this screen.
  -d --debug  Debug mode.
`.trim()
)

const spawn = require('./spawn')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

;(async () => {
  for (const name of args['<package>']) {
    const cwd = path.join(process.env.TEMP, 'leopkg', name)
    await mkdirp(cwd)
    process.chdir(cwd)

    let gitCommands = [
      ['git', 'clone', `https://github.com/leobastiani/${name}`, cwd]
    ]
    if (fs.existsSync(path.join(cwd, '.git'))) {
      gitCommands = [
        ['git', 'fetch'],
        ['git', 'checkout', 'origin/master']
      ]
    }
    const commands = [
      ...gitCommands,
      ['choco', 'install', '-y', '-s', '.', name]
    ]

    for (const command of commands) {
      const [head, ...tail] = command
      const exitCode = await spawn(head, tail)
      if (exitCode !== 0) {
        process.exit(exitCode)
      }
    }
  }
})()
