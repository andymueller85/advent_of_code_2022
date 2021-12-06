import * as fs from 'fs'

export const spawnFishies = (fileName, days) => {
  const input = fs.readFileSync(fileName, 'utf8').replace('\n', '').split(',')
  const fishieCount = timer => input.filter(f => f === timer).length

  let f0 = fishieCount('0')
  let f1 = fishieCount('1')
  let f2 = fishieCount('2')
  let f3 = fishieCount('3')
  let f4 = fishieCount('4')
  let f5 = fishieCount('5')
  let f6 = fishieCount('6')
  let f7 = fishieCount('7')
  let f8 = fishieCount('8')

  Array.from({ length: days }).forEach(() => {
    const f0Holder = f0
    f0 = f1
    f1 = f2
    f2 = f3
    f3 = f4
    f4 = f5
    f5 = f6
    f6 = f0Holder + f7
    f7 = f8
    f8 = f0Holder
  })

  return f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8
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

process('B', 26984457539, 256)
