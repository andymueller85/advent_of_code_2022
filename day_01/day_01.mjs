import * as fs from 'fs'

const getSums = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split('\n\n')
    .map(e =>
      e
        .split(/\r?\n/)
        .filter(d => d)
        .reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0)
    )

const top1 = fileName => Math.max(...getSums(fileName))

const top3 = fileName =>
  getSums(fileName)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc + cur)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_01/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_01/input.txt'))
}

process('A', 24000, top1)
process('B', 45000, top3)
