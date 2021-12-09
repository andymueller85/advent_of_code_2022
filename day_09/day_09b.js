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

  const getBasin = (rI, cI) => {
    let coordinates = []

    const recurse = (rowIndex, colIndex) => {
      if (
        !coordinates
          .map(([r, c]) => [r.toString(), c.toString()].join(''))
          .includes([rowIndex.toString(), colIndex.toString()].join(''))
      )
        coordinates.push([rowIndex, colIndex])

      const rowNeighbors = [
        ...(colIndex > 0 ? [[rowIndex, colIndex - 1]] : []),
        ...(colIndex < input[0].length - 1 ? [[rowIndex, colIndex + 1]] : [])
      ]
      const columnNeighbors = [
        ...(rowIndex > 0 ? [[rowIndex - 1, colIndex]] : []),
        ...(rowIndex < input.length - 1 ? [[rowIndex + 1, colIndex]] : [])
      ]

      const neighbors = [...rowNeighbors, ...columnNeighbors].filter(
        ([r, c]) => input[r][c] !== 9 && input[r][c] > input[rowIndex][colIndex]
      )

      if (neighbors.length === 0) {
        return
      }

      neighbors.forEach(([r, c]) => {
        recurse(r, c)
      })
    }

    recurse(rI, cI)
    return coordinates.length
  }

  const basinLengths = []

  input.forEach((r, rowIndex) => {
    r.forEach((h, colIndex) => {
      if (getNeighbors(rowIndex, colIndex).every(n => n > h)) {
        basinLengths.push(getBasin(rowIndex, colIndex))
      }
    })
  })

  return basinLengths
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc * cur)
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

process('B', 1134)
