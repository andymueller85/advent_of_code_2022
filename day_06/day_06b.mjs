import * as fs from 'fs'

export const spawnFishies = (fileName, days) => {
  const input = fs.readFileSync(fileName, 'utf8').replace('\n', '').split(',')
  const fishiesArray = Array.from(
    { length: 9 },
    (_, i) => input.filter(f => f === i.toString()).length
  )

  Array.from({ length: days }).forEach(() => {
    const f0Holder = fishiesArray[0]

    Array.from({ length: 8 }, (_, i) => i).forEach(f => {
      fishiesArray[f] = fishiesArray[f + 1]
    })

    fishiesArray[6] += f0Holder
    fishiesArray[8] = f0Holder
  })

  return fishiesArray.reduce((acc, cur) => acc + cur)
}

const process = (part, expectedAnswer, days) => {
  const sampleAnswer = spawnFishies('./day_06/sample_input.txt', days)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    spawnFishies('./day_06/input.txt', days)
  )
}

process('A', 5934, 80)
process('B', 26984457539, 256)