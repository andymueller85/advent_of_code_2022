const go = (fileName, includeDiagonals) => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)

  const grid = Array.from({ length: 1000 }).map(a =>
    Array.from({ length: 1000 }, () => 0)
  )

  const splitCoordinates = coordinates =>
    coordinates.split(',').map(c => parseInt(c, 10))

  input.forEach(line => {
    const [startingCoordinates, endingCoordinates] = line.split(' -> ')

    const [startX, startY] = splitCoordinates(startingCoordinates)
    const [endX, endY] = splitCoordinates(endingCoordinates)

    if (startX === endX) {
      // vertical
      const lineLength = Math.abs(endY - startY) + 1
      const startIndex = startY < endY ? startY : endY
      for (i = startIndex; i < startIndex + lineLength; i++) {
        grid[i][startX]++
      }
    } else if (startY === endY) {
      // horizontal
      const lineLength = Math.abs(startX - endX) + 1
      const startIndex = startX < endX ? startX : endX
      for (i = startIndex; i < startIndex + lineLength; i++) {
        grid[startY][i]++
      }
    } else if (includeDiagonals) {
      // diagonal
      const lineLength = Math.abs(startX - endX) + 1
      const startXIndex = startX < endX ? startX : endX
      let x = startXIndex

      if (
        (startY > endY && startX < endX) ||
        (startY < endY && startX > endX)
      ) {
        // up slope
        const startYIndex = startY < endY ? endY : startY
        let y = startYIndex

        while (x < startXIndex + lineLength) {
          grid[y][x]++
          x++
          y--
        }
      } else {
        // down slope
        const startYIndex = startY < endY ? startY : endY
        let y = startYIndex

        while (x < startXIndex + lineLength) {
          grid[y][x]++
          x++
          y++
        }
      }
    }
  })

  return grid.flat().reduce((acc, cur) => acc + (cur >= 2 ? 1 : 0), 0)
}


const process = (part, expectedAnswer, includeDiagonals) => {
  const sampleAnswer = go('./day_05/sample_input.txt', includeDiagonals)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`${part} one sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    go('./day_05/input.txt', includeDiagonals)
  )
}

process('a', 5, false)
process('b', 12, true)

