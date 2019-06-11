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
  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  switch (command) {
    case 'dailycw':
      return client.commands.get('dailycw').execute(message, args)
    case 'tldr':
      return client.commands.get('tldr').execute(message, args)
  }
})

client.login(process.env.BOT_TOKEN)
