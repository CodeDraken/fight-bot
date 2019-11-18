const fse = require('fs-extra')
const path = require('path')
const _ = require('lodash')

async function generateDaily () {
  try {
    const dataPath = path.resolve(__dirname, '../../data')
    const fileNames = await fse.readdir(dataPath)
    const now = new Date()

    let data = fileNames
      .map(file => {
        const json = fse.readJsonSync(path.join(dataPath, file))

        return json
      })
      .reduce((acc, arr) => [...acc, ...arr], [])

    data = _.shuffle(data)
      .map(({ title, link }, i) => {
        const date = new Date()

        date.setDate(now.getDate() + i)

        return {
          title,
          link,
          date: date.toLocaleDateString()
        }
      })

    fse.writeFileSync(
      path.resolve(__dirname, './daily.json'),
      JSON.stringify(data, null, 2)
    )
  } catch (e) {
    console.log(e)
  }
}

generateDaily()

module.exports = generateDaily
