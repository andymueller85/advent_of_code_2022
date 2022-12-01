import * as fs from 'fs'

export const countCalories = fileName => {
  const elves = fs
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .split('\n\n')
    .filter(d => d)

  const elvesMap = elves.map(e =>
    e
      .split('\n')
      .filter(d => d)
      .reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0)
  )

  return elvesMap
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc + cur)
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = countCalories('./day_01/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, countCalories('./day_01/input.txt'))
}

process('A', 45000)
