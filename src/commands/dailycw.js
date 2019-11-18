const axios = require('axios')

const getDailyChallenge = async () => {
  try {
    const today = new Date()

    const challenges = (await axios.get('https://raw.githubusercontent.com/CodeDraken/fight-bot/master/src/data-utils/daily.json')).data

    return challenges.find(({ title, link, date }) => {
      const d = new Date(date)

      return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth()
    })
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = {
  name: 'dailycw',
  description: 'Get the daily CodeWars challenge',

  async execute (message, args) {
    try {
      const dailyChallenge = await getDailyChallenge()

      if (!dailyChallenge) {
        return message.channel.send('I couldn\'t find today\'s challenge!')
      }

      return message.channel.send(`**Today's CodeWars Challenge:** \n\`\`\`diff\n-${dailyChallenge.title}\n\`\`\`\n${dailyChallenge.link}`)
    } catch (e) {
      return message.channel.send('I couldn\'t find today\'s challenge!')
    }
  }
}
