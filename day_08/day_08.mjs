import * as fs from 'fs'

const swapXy = (grid, gridWidth) => {
  const allIndexes = Array.from({ length: gridWidth }, (_, i) => i)
  return allIndexes.map(c => grid.map(r => r[c]))
}

const constructGrid = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => [...r].map(c => parseInt(c)))

const isEdge = (index, length) => index === 0 || index === length - 1
const isShortest = (row, val) => row.every(t => t < val)

const countVisibleTrees = fileName => {
  const grid = constructGrid(fileName)
  const gridWidth = grid[0].length
  const gridHeight = grid.length
  const swappedGrid = swapXy(grid, gridWidth)

  return grid.reduce((rowAcc, curRow, rowIndex) => {
    return (
      rowAcc +
      curRow.reduce((colAcc, curCell, colIndex) => {
        const colArr = swappedGrid[colIndex]

        if (
          isEdge(rowIndex, gridWidth) ||
          isEdge(colIndex, gridHeight) ||
          isShortest(curRow.slice(0, colIndex), curCell) || // west
          isShortest(curRow.slice(colIndex + 1), curCell) || // east
          isShortest(colArr.slice(0, rowIndex), curCell) || // north
          isShortest(colArr.slice(rowIndex + 1), curCell) // south
        ) {
          return colAcc + 1
        }

        return colAcc
      }, 0)
    )
  }, 0)
}

const viewingDistance = (treeLine, cell) => {
  const viewBlockedIndex = treeLine.findIndex(t => t >= cell)
  return viewBlockedIndex === -1 ? treeLine.length : viewBlockedIndex + 1
}

const getHightestScenicScore = fileName => {
  const grid = constructGrid(fileName)
  const gridWidth = grid[0].length
  const swappedGrid = swapXy(grid, gridWidth)

  return grid.reduce((rowAcc, curRow, rowIndex) => {
    return Math.max(
      curRow.reduce((colAcc, curCell, colIndex) => {
        const colArr = swappedGrid[colIndex]

        const east = viewingDistance(curRow.slice(colIndex + 1), curCell)
        const west = viewingDistance(curRow.slice(0, colIndex).reverse(), curCell)
        const north = viewingDistance(colArr.slice(0, rowIndex).reverse(), curCell)
        const south = viewingDistance(colArr.slice(rowIndex + 1), curCell)
        return Math.max(east * west * north * south, colAcc)
      }, 0),
      rowAcc
    )
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
process('B', 8, getHightestScenicScore)
