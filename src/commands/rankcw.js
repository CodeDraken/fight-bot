const axios = require('axios')
const Discord = require('discord.js')

const fetchCWUser = async username => {
  try {
    const user = (await axios.get(`https://www.codewars.com/api/v1/users/${username}`)).data

    return user
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = {
  name: 'rankcw',
  description: 'Get info on a user from CodeWars',

  async execute (message, args) {
    try {
      console.log(args, args[0])
      const username = args[0]

      if (/[^\w]/gi.test(username)) return message.channel.send(`I couldn't find that user!`)

      const user = await fetchCWUser(username)

      if (!user) return message.channel.send(`I couldn't find that user!`)

      const {
        honor,
        leaderboardPosition,
        ranks: {
          overall: {
            name: rank,
            score
          },
          languages
        },
        codeChallenges: {
          totalAuthored: authored,
          totalCompleted: completed
        }
      } = user

      const cwEmbed = new Discord.RichEmbed()
        .setColor('#8E372A')
        .setTitle(`CodeWars: ${username}`)
        .setImage(`https://www.codewars.com/users/${username}/badges/large`)
        .setTimestamp()
        .setFooter(`Use !rankcw "username" to get another user`)
        .setDescription(`${username} has ${honor} honora and is rank ${rank}, with an overall score of ${score} placing at #${leaderboardPosition} on the leaderboard.`)

      Object.keys(languages).forEach(lang => {
        const { name: langRank, score } = languages[lang]

        cwEmbed.addField(`${lang}`, `${langRank} | score ${score}`, true)
      })

      cwEmbed.addBlankField()
      cwEmbed.addField(`Total Challenges Completed`, `${completed}`, true)
      cwEmbed.addField(`Total Challenges Authored`, `${authored}`, true)

      message.channel.send(cwEmbed)
    } catch (e) {
      console.log(e)
      return message.channel.send(`I couldn't find that user!`)
    }
  }
}
