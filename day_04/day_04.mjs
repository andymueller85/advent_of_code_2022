import * as fs from 'fs'

const parsePairs = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const getBoundaries = range => range.split('-').map(l => parseInt(l, 10))

const getElves = pair => {
  const [e1Range, e2Range] = pair.split(',')
  const [e1Lower, e1Upper] = getBoundaries(e1Range)
  const [e2Lower, e2Upper] = getBoundaries(e2Range)

  return { e1: { lower: e1Lower, upper: e1Upper }, e2: { lower: e2Lower, upper: e2Upper } }
}

const cleanupCampA = fileName =>
  parsePairs(fileName).reduce((acc, cur) => {
    const { e1, e2 } = getElves(cur)
    const subset =
      (e1.lower <= e2.lower && e1.upper >= e2.upper) ||
      (e2.lower <= e1.lower && e2.upper >= e1.upper)

    return acc + (subset ? 1 : 0)
  }, 0)

const cleanupCampB = fileName =>
  parsePairs(fileName).reduce((acc, cur) => {
    const { e1, e2 } = getElves(cur)
    const overlap =
      (e1.lower >= e2.lower && e1.lower <= e2.upper) ||
      (e1.upper >= e2.lower && e1.upper <= e2.upper) ||
      (e2.lower >= e1.lower && e2.lower <= e1.upper) ||
      (e2.upper >= e1.lower && e2.upper <= e1.upper)

    return acc + (overlap ? 1 : 0)
  }, 0)

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
