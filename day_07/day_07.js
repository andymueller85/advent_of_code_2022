const alignCrabs = (fileName, crabCostFn) => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace('\n', '')
    .split(',')
    .map(n => parseInt(n, 10))

  const [min, max] = [Math.min(...input), Math.max(...input)]

  return Array.from({ length: max - min + 1 }, (_, i) => i + min).reduce(
    (overallMin, destination) => {
      const totalCrabFuelConsumption = input.reduce(
        (crabFuel, crabPosition) =>
          crabFuel + crabCostFn(crabPosition, destination),
        0
      )

      return Math.min(totalCrabFuelConsumption, overallMin)
    },
    Number.MAX_VALUE
  )
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

// This is pretty inefficient. It could probably be
// made smarter by sorting the numbers and starting in the middle and working outward.
// Once the values start getting bigger, can stop checking.
process('B', 168, premiumCrabCost)
