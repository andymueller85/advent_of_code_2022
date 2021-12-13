const decodeDigits = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => d.split(' | '))
    .map(([pattern, output]) => ({
      pattern: pattern.split(' '),
      output: output.split(' ')
    }))

  const uniqueSegments = [2, 4, 3, 7]

  return input
    .map(i => i.output)
    .flat()
    .reduce(
      (acc, cur) => acc + (uniqueSegments.includes(cur.length) ? 1 : 0),
      0
    )
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = decodeDigits('./day_08/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, decodeDigits('./day_08/input.txt'))
}

process('A', 26)
// process('B', 168, premiumCrabCost)
