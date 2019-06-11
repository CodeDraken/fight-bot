require('dotenv').config()

const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')

const { prefix } = require('./config.json')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs
  .readdirSync(path.join('src', 'commands'))
  .filter(file => file.endsWith('.js'))

commandFiles.forEach(file => {
  const command = require(path.join(__dirname, 'commands', file))

  client.commands.set(command.name, command)
})

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', async message => {
  try {
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    if (!client.commands.has(commandName)) return

    const command = client.commands.get(commandName)

    command.execute(message, args)
  } catch (e) {
    console.log(e)
  }
})

client.login(process.env.BOT_TOKEN)
