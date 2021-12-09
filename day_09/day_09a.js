const findLowPoints = (fileName, crabCostFn) => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(r => r.split('').map(h => parseInt(h, 10)))

  const getNeighbors = (rowIndex, colIndex) => {
    const rowNeighbors = [
      ...(colIndex > 0 ? [input[rowIndex][colIndex - 1]] : []),
      ...(colIndex < input[0].length - 1 ? [input[rowIndex][colIndex + 1]] : [])
    ]
    const columnNeighbors = [
      ...(rowIndex > 0 ? [input[rowIndex - 1][colIndex]] : []),
      ...(rowIndex < input.length - 1 ? [input[rowIndex + 1][colIndex]] : [])
    ]

    return [...rowNeighbors, ...columnNeighbors]
  }

  return input.reduce(
    (acc, r, rowIndex) =>
      acc +
      r.reduce(
        (innerAcc, h, colIndex) =>
          innerAcc +
          (getNeighbors(rowIndex, colIndex).every(n => n > h) ? h + 1 : 0),
        0
      ),
    0
  )
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = findLowPoints('./day_09/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, findLowPoints('./day_09/input.txt'))
}

process('A', 15)
