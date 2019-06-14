const { execFile } = require('child_process')
const path = require('path')

module.exports = {
  name: 'tldr',
  description: 'Get a tldr man page',

  async execute (message, args) {
    try {
      const tldrPath = path.join('node_modules', 'tldr', 'bin', 'tldr')
      args = Array.isArray(args) ? args.join(' ') : args

      execFile(`node`, [tldrPath, args], (err, stdout, stderr) => {
        if (err) throw err
        if (stderr) throw stderr

        if (stdout) {
          const msg = stdout // .split('\n').slice(4).join('\n')
          return message.channel.send(
            `**${args}**\n\`\`\`${msg}\`\`\``
          )
        } else {
          return message.channel.send(`I couldn't find that page.`)
        }
      })
    } catch (e) {
      console.log(e)
      return message.channel.send(`I couldn't find that page.`)
    }
  }
}
