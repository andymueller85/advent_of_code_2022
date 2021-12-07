const alignCrabs = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace('\n', '')
    .split(',')
    .map(n => parseInt(n, 10))

  const min = Math.min(...input)
  const max = Math.max(...input)

  const crabCost = (pos, destination) => {
    const distance = Math.abs(pos - destination)

    return Array.from({ length: distance + 1 }, (_, i) => i + 1).reduce(
      (acc, _, i) => acc + i,
      0
    )
  }

  return Array.from({ length: max - min + 1 }, (_, i) => i + min).reduce(
    (overallMin, destination) => {
      const totalCrabFuelConsumption = input.reduce(
        (crabFuel, crabPosition) =>
          crabFuel + crabCost(crabPosition, destination),
        0
      )

      return Math.min(totalCrabFuelConsumption, overallMin)
    },
    Number.MAX_VALUE
  )
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = alignCrabs('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, alignCrabs('./day_07/input.txt'))
}

process('B', 168)
