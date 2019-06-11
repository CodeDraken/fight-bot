const { exec } = require('child_process')

module.exports = {
  name: 'tldr',
  description: 'Get a tldr man page',

  async execute (message, args) {
    args = Array.isArray(args) ? args.join(' ') : args

    exec(`npm run tldr ${args}`, (err, stdout, stderr) => {
      if (err) throw err
      if (stderr) throw stderr

      if (stdout) {
        return message.channel.send(stdout)
      } else {
        return message.channel.send(`I couldn't find that page.`)
      }
    })
  }
}
