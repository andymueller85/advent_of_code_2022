const input = require('fs')
  .readFileSync('./day_05/input.txt', 'utf8')
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
  }
  if (startY === endY) {
    // horizontal
    const lineLength = Math.abs(startX - endX) + 1
    const startIndex = startX < endX ? startX : endX

    for (i = startIndex; i < startIndex + lineLength; i++) {
      grid[startY][i]++
    }
  }
})

const atLeastTwoLinesOverlapCount = grid
  .flat()
  .reduce((acc, cur) => acc + (cur >= 2 ? 1 : 0), 0)

console.log('answer', atLeastTwoLinesOverlapCount)
