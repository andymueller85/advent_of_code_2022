import * as fs from 'fs'

const parsePairs = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const getBoundaries = range => range.split('-').map(l => parseInt(l))

const cleanupCampA = fileName => {
  return parsePairs(fileName).reduce((acc, cur) => {
    const [e1Range, e2Range] = cur.split(',')
    const [e1Lower, e1Upper] = getBoundaries(e1Range)
    const [e2Lower, e2Upper] = getBoundaries(e2Range)

    if ((e1Lower <= e2Lower && e1Upper >= e2Upper) || (e2Lower <= e1Lower && e2Upper >= e1Upper)) {
      return acc + 1
    }

    return acc
  }, 0)
}

const cleanupCampB = fileName => {
  return parsePairs(fileName).reduce((acc, cur) => {
    const [e1Range, e2Range] = cur.split(',')
    const [e1Lower, e1Upper] = getBoundaries(e1Range)
    const [e2Lower, e2Upper] = getBoundaries(e2Range)

    if (
      (e1Lower >= e2Lower && e1Lower <= e2Upper) ||
      (e1Upper >= e2Lower && e1Upper <= e2Upper) ||
      (e2Lower >= e1Lower && e2Lower <= e1Upper) ||
      (e2Upper >= e1Lower && e2Upper <= e1Upper)
    ) {
      return acc + 1
    }

    return acc
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_04/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_04/input.txt'))
}

process('A', 2, cleanupCampA)
process('B', 4, cleanupCampB)
