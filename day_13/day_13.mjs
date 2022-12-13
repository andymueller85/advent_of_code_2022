import * as fs from 'fs'

// returns negative if a < b, 0 if a == b, positive if a > b.
const compare = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  } else if (Array.isArray(left) && typeof right === 'number') {
    return compare(left, [right])
  } else if (typeof left === 'number' && Array.isArray(right)) {
    return compare([left], right)
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const c = compare(left[i], right[i])
      if (c !== 0) return c
    }
    return left.length - right.length
  }
}

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(pair =>
      pair
        .split(/\r?\n/)
        .filter(d => d)
        .map(packet => JSON.parse(packet))
    )

const partA = fileName =>
  parseInput(fileName).reduce(
    (acc, [left, right], i) => acc + (compare(left, right) < 0 ? i + 1 : 0),
    0
  )

const partB = fileName => {
  const decoder1 = [[2]]
  const decoder2 = [[6]]

  const sorted = parseInput(fileName).flat().concat([decoder1, decoder2]).sort(compare)
  return (sorted.findIndex(s => s === decoder1) + 1) * (sorted.findIndex(s => s === decoder2) + 1)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_13/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_13/input.txt'))
}

process('A', 13, partA)
process('B', 140, partB)
