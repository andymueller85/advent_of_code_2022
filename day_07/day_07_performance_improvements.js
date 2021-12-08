const alignCrabs = (fileName, crabCostFn) => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace('\n', '')
    .split(',')
    .map(n => parseInt(n, 10))
    .sort((a, b) => a - b)

  const middleishIndex = Math.round(
    input.reduce((acc, cur) => acc + cur) / input.length
  )

  const getCost = i =>
    input.reduce((cost, crabPosition) => cost + crabCostFn(crabPosition, i), 0)

  const middleishCost = getCost(middleishIndex)

  const getCandidate = goingUp => {
    let baseCost = middleishCost
    let cursor = middleishIndex
    let candidate = 0

    while (candidate <= baseCost) {
      cursor += goingUp ? 1 : -1
      candidate = getCost(cursor)
      baseCost = Math.min(baseCost, candidate)
    }

    return baseCost
  }

  // This went from ~1.5 min to ~100 ms for part B
  return Math.min(getCandidate(true), getCandidate(false))
}

const process = (part, expectedSampleAnswer, crabCostFn) => {
  const sampleAnswer = alignCrabs('./day_07/sample_input.txt', crabCostFn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(
    `part ${part} real answer`,
    alignCrabs('./day_07/input.txt', crabCostFn)
  )
}

const cheapCrabCost = (a, b) => Math.abs(a - b)
const premiumCrabCost = (a, b) => {
  const steps = Array.from({ length: Math.abs(a - b) + 1 }, (_, i) => i + 1)
  return steps.reduce((acc, _, i) => acc + i, 0)
}

process('A', 37, cheapCrabCost)
process('B', 168, premiumCrabCost)
