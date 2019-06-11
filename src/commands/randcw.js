const axios = require('axios')

// random number between min (inclusive) and max (exclusive)
const randNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const getRandomChallenge = async () => {
  try {
    const challenges = (await axios.get('https://gist.githubusercontent.com/CodeDraken/de9fcf321f86ceb51474b6376f91797f/raw/b68977687d16f16be453fccbe059f2380e75d686/katas-1.json')).data

    const rand = randNum(0, challenges.length)

    return challenges[rand]
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = {
  name: 'randcw',
  description: 'Get a random CodeWars challenge',

  async execute (message, args) {
    try {
      const challenge = await getRandomChallenge()

      if (!challenge) {
        return message.channel.send(`I couldn't find any challenges!`)
      }

      return message.channel.send(`**Random CodeWars Challenge:** \n\`\`\`diff\n-${challenge.title}\n\`\`\`\n${challenge.link}`)
    } catch (e) {
      console.log(e)
      return message.channel.send(`I couldn't find any challenges!`)
    }
  }
}
