import * as fs from 'fs'

export const countCalories = fileName =>
  Math.max(
    ...fs
      .readFileSync(fileName, 'utf8')
      .split('\n\n')
      .map(e =>
        e
          .split(/\r?\n/)
          .filter(d => d)
          .reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0)
      )
  )

const process = (part, expectedAnswer) => {
  const sampleAnswer = countCalories('./day_01/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, countCalories('./day_01/input.txt'))
}

process('A', 24000)
