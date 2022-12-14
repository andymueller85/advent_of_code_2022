import * as fs from 'fs'

const swapXy = (grid, gridWidth) => {
  const allIndexes = Array.from({ length: gridWidth }, (_, i) => i)
  return allIndexes.map(c => grid.map(r => r[c]))
}

const initialize = fileName => {
  const grid = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => [...r].map(c => parseInt(c)))
  const gridWidth = grid[0].length
  const gridHeight = grid.length
  const swappedGrid = swapXy(grid, gridWidth)

  return { grid, gridWidth, gridHeight, swappedGrid }
}

const countVisibleTrees = fileName => {
  const { grid, gridWidth, gridHeight, swappedGrid } = initialize(fileName)
  const isEdge = (index, length) => index === 0 || index === length - 1
  const isTallest = (row, val) => row.every(t => t < val)

  return grid.reduce((rowAcc, curRow, rowIndex) => {
    return (
      rowAcc +
      curRow.reduce((colAcc, curCell, colIndex) => {
        return isEdge(rowIndex, gridWidth) ||
          isEdge(colIndex, gridHeight) ||
          isTallest(swappedGrid[colIndex].slice(0, rowIndex), curCell) || // north
          isTallest(swappedGrid[colIndex].slice(rowIndex + 1), curCell) || // south
          isTallest(curRow.slice(colIndex + 1), curCell) || // east
          isTallest(curRow.slice(0, colIndex), curCell) // west
          ? colAcc + 1
          : colAcc
      }, 0)
    )
  }, 0)
}

const getHighestScenicScore = fileName => {
  const { grid, swappedGrid } = initialize(fileName)
  const viewingDistance = (treeLine, cell) => {
    const viewBlockedIndex = treeLine.findIndex(t => t >= cell)
    return viewBlockedIndex === -1 ? treeLine.length : viewBlockedIndex + 1
  }

  return grid.reduce((rowAcc, curRow, rowIndex) => {
    const bestViewingDistance = curRow.reduce((colAcc, curCell, colIndex) => {
      const north = viewingDistance(swappedGrid[colIndex].slice(0, rowIndex).reverse(), curCell)
      const south = viewingDistance(swappedGrid[colIndex].slice(rowIndex + 1), curCell)
      const east = viewingDistance(curRow.slice(colIndex + 1), curCell)
      const west = viewingDistance(curRow.slice(0, colIndex).reverse(), curCell)
      return Math.max(north * south * east * west, colAcc)
    }, 0)

    return Math.max(bestViewingDistance, rowAcc)
  }, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_08/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_08/input.txt'))
}

process('A', 21, countVisibleTrees)
process('B', 8, getHighestScenicScore)
