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

const countTrees = fileName => {
  const grid = constructGrid(fileName)

  const gridWidth = grid[0].length
  const gridHeight = grid.length

  return grid.reduce((rowAcc, curRow, rowIndex) => {
    return (
      rowAcc +
      curRow.reduce((colAcc, curCell, colIndex) => {
        const colArr = swapXy(grid, gridWidth)[colIndex]

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

const process = (part, expectedAnswer) => {
  const sampleAnswer = countTrees('./day_08/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, countTrees('./day_08/input.txt'))
}

process('A', 21)
