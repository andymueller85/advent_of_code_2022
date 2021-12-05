const mapHydrothermalVents = (fileName, gridSize, includeDiagonals) => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)

  const grid = Array.from({ length: gridSize }).map(a =>
    Array.from({ length: gridSize }, () => 0)
  )

  const splitCoordinates = coordinates =>
    coordinates.split(',').map(c => parseInt(c, 10))

  const makeDiagonalLine = (isUpSlope, startYIndex, startX, endX) => {
    const lineLength = Math.abs(startX - endX) + 1
    const startXIndex = startX < endX ? startX : endX
    let y = startYIndex

    for (let x = startXIndex; x < startXIndex + lineLength; x++) {
      grid[y][x]++
      y += isUpSlope ? -1 : 1
    }
  }

  input.forEach(line => {
    const [startingCoordinates, endingCoordinates] = line.split(' -> ')
    const [startX, startY] = splitCoordinates(startingCoordinates)
    const [endX, endY] = splitCoordinates(endingCoordinates)

    if (startX === endX) {
      // vertical
      const start = Math.min(startY, endY)

      for (let i = start; i < start + Math.abs(endY - startY) + 1; i++) {
        grid[i][startX]++
      }
    } else if (startY === endY) {
      // horizontal
      const start = Math.min(startX, endX)

      for (let i = start; i < start + Math.abs(startX - endX) + 1; i++) {
        grid[startY][i]++
      }
    } else if (includeDiagonals) {
      if (
        (startY > endY && startX < endX) ||
        (startY < endY && startX > endX)
      ) {
        // up slope
        makeDiagonalLine(true, Math.max(startY, endY), startX, endX)
      } else {
        // down slope
        makeDiagonalLine(false, Math.min(startY, endY), startX, endX)
      }
    }
  })

  return grid.flat().reduce((acc, cur) => acc + (cur >= 2 ? 1 : 0), 0)
}

const process = (part, expectedAnswer, includeDiagonals) => {
  const sampleAnswer = mapHydrothermalVents(
    './day_05/sample_input.txt',
    10,
    includeDiagonals
  )

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    mapHydrothermalVents('./day_05/input.txt', 1000, includeDiagonals)
  )
}

process('A', 5, false)
process('B', 12, true)
