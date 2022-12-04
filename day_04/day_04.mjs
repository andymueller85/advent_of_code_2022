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

const partATest = ({ e1, e2 }) =>
  (e1.lower <= e2.lower && e1.upper >= e2.upper) || (e2.lower <= e1.lower && e2.upper >= e1.upper)

const partBTest = ({ e1, e2 }) =>
  (e1.lower >= e2.lower && e1.lower <= e2.upper) ||
  (e1.upper >= e2.lower && e1.upper <= e2.upper) ||
  (e2.lower >= e1.lower && e2.lower <= e1.upper) ||
  (e2.upper >= e1.lower && e2.upper <= e1.upper)

const cleanupCamp = (fileName, testFn) =>
  parsePairs(fileName).reduce((acc, cur) => acc + (testFn(parseElves(cur)) ? 1 : 0), 0)

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
