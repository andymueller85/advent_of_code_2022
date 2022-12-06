import * as fs from 'fs'

const arrValuesUnique = arr => new Set(arr).size === arr.length
const findMarker = (fileName, charCount) =>
  fs
    .readFileSync(fileName, 'utf8')
    .split('')
    .findIndex((_, i, arr) => i >= charCount && arrValuesUnique(arr.slice(i - charCount, i)))

const process = (part, expectedAnswer, charCount) => {
  const sampleAnswer = findMarker('./day_06/sample_input.txt', charCount)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, findMarker('./day_06/input.txt', charCount))
}

process('A', 7, 4)
process('B', 19, 14)
