import * as fs from 'fs'

const topN = (fileName, n) =>
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
    .slice(0, n)
    .reduce((acc, cur) => acc + cur)

const process = (part, expectedAnswer, n) => {
  const sampleAnswer = topN('./day_01/sample_input.txt', n)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, topN('./day_01/input.txt', n))
}

process('A', 24000, 1)
process('B', 45000, 3)
