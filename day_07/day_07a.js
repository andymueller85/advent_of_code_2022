const alignCrabs = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace('\n', '')
    .split(',')
    .map(n => parseInt(n, 10))

  const min = Math.min(...input)
  const max = Math.max(...input)

  return Array.from({ length: max - min + 1 }, (_, i) => i + min).reduce(
    (acc, position, i) => {
      const crabFuelConsumption = input.reduce(
        (crabFuel, crabPosition) =>
          crabFuel + Math.abs(crabPosition - position),
        0
      )

      return Math.min(crabFuelConsumption, acc)
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

process('A', 37)
