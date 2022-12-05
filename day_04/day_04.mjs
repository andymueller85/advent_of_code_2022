import * as fs from 'fs'

const parsePairs = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const parseBoundaries = range => range.split('-').map(l => parseInt(l, 10))

const parseElves = pair => {
  const [e1Range, e2Range] = pair.split(',')
  const [e1Lower, e1Upper] = parseBoundaries(e1Range)
  const [e2Lower, e2Upper] = parseBoundaries(e2Range)

  return { e1: { lower: e1Lower, upper: e1Upper }, e2: { lower: e2Lower, upper: e2Upper } }
}

const subset = (a, b) => a.lower <= b.lower && a.upper >= b.upper
const overlap = (a, b) =>
  (a.lower >= b.lower && a.lower <= b.upper) || (a.upper >= b.lower && a.upper <= b.upper)

const partATest = ({ e1, e2 }) => subset(e1, e2) || subset(e2, e1)
const partBTest = ({ e1, e2 }) => overlap(e1, e2) || overlap(e2, e1)

const cleanupCamp = (fileName, testFn) =>
  parsePairs(fileName).filter(pair => testFn(parseElves(pair))).length

const process = (part, expectedAnswer, testFn) => {
  const sampleAnswer = cleanupCamp('./day_04/sample_input.txt', testFn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, cleanupCamp('./day_04/input.txt', testFn))
}

process('A', 2, partATest)
process('B', 4, partBTest)
