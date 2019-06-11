require('dotenv').config()

const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()

const getDailyChallenge = async () => {
  try {
    const today = new Date()

    const challenges = (await axios.get('https://gist.githubusercontent.com/CodeDraken/de9fcf321f86ceb51474b6376f91797f/raw/b68977687d16f16be453fccbe059f2380e75d686/katas-1.json')).data

    return challenges.find(({ title, link, date }) => {
      const d = new Date(date)

      return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth()
    })
  } catch (e) {
    console.log(e)
  }
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', async message => {
  if (message.content === '!cw') {
    const dailyChallenge = await getDailyChallenge()

    if (!dailyChallenge) {
      return message.channel.send(`I couldn't find today's challenge!`)
    }

    message.channel.send(`**Today's CodeWars Challenge:** \n\`\`\`diff\n-${dailyChallenge.title}\n\`\`\`\n${dailyChallenge.link}`)
  }
})

client.login(process.env.BOT_TOKEN)
