// TODO: Add traincw command
// !traincw kyu(1-8) amount(1-5)
// cooldown 1 minute

const _ = require('lodash')
const fse = require('fs-extra')
const path = require('path')
const Discord = require('discord.js')

const ranks = {
  8: '8kyu',
  7: '7kyu',
  6: '6kyu',
  5: '5kyu',
  4: '4kyu'
}

const getChallenges = async (rank = 8, amount = 1, languages = []) => {
  try {
    if (!(rank in ranks)) throw new Error('Invalid rank!')

    const dataPath = path.join('data', `${ranks[rank]}.json`)
    let data = JSON.parse(await fse.readFile(dataPath))

    if (languages.length) {
      data = data.filter(kata => _.includes(kata.languages, ...languages))
    }

    const randomNums = []
    const grabbed = []

    // select random indexes
    while (randomNums.length < amount) {
      const dataLen = data.length
      let rand = _.random(dataLen)

      while (randomNums.includes(rand)) {
        // regenerate
        rand = _.random(dataLen)
      }

      randomNums.push(rand)
      grabbed.push(data[rand])
    }

    return grabbed
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = {
  name: 'traincw',
  description: 'Get a random selection of tasks by rank and language',
  cooldown: 60,

  async execute (message, [rank, amount, ...languages]) {
    try {
      // no amount provided
      if (isNaN(amount)) {
        languages.push(amount)
        amount = 2
      }

      if (isNaN(rank)) {
        return message.channel.send(`Invalid query!`)
      }

      if (amount > 5) {
        amount = 2
      }

      // sanitize language input
      languages = languages.reduce((acc, lang) => {
        if (lang && typeof lang === 'string' && lang.trim().length) {
          return [...acc, lang.toLowerCase().trim()]
        }
        return acc
      }, [])

      const challenges = await getChallenges(rank, amount, languages)

      if (!challenges) {
        return message.channel.send(`I couldn't find any challenges!`)
      }

      const languagesStr = languages.length
        ? languages.join(', ')
        : 'Any Language'

      const cwEmbed = new Discord.RichEmbed()
        .setColor('#8E372A')
        .setTitle(`CodeWars Training`)
        .setTimestamp()
        .setDescription(`Training on ${rank} kyu, ${amount} challenges in ${languagesStr}`)
        .setFooter(`Use !traincw {1-8 kyu rank} {1-5 amount} {...languages}`)

      challenges.forEach(({ title, link, languages: kataLangs }) => {
        cwEmbed.addField(title, `${link}\nAvailable in: ${kataLangs.join(', ')}`)
      })

      return message.channel.send(cwEmbed)
    } catch (e) {
      console.log(e)
      return message.channel.send(`I couldn't find any challenges!`)
    }
  }
}
