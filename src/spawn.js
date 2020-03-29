const { spawn } = require('child_process')

const cwdLog = () => process.cwd()

module.exports = (command, args) => {
  console.log(`----> ${cwdLog()} ${command} ${args.join(' ')}`)
  const child = spawn(command, args, { stdio: 'inherit' })

  return new Promise(resolve => {
    child.on('close', code => {
      resolve(code)
    })
  })
}
