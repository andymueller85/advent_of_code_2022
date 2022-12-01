import * as fs from 'fs'

export const countCalories = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split('\n\n')
    .map(e =>
      e
        .split(/\r?\n/)
        .filter(d => d)
        .reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0)
    )
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc + cur)

const process = (part, expectedAnswer) => {
  const sampleAnswer = countCalories('./day_01/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, countCalories('./day_01/input.txt'))
}

process('A', 45000)
