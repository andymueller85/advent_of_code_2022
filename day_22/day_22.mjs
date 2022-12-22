import * as fs from 'fs'

const WALL = '#'
const OPEN_TILE = '.'
const THE_VOID = ' '
const EAST = 'E'
const NORTH = 'N'
const WEST = 'W'
const SOUTH = 'S'

const directions = [EAST, SOUTH, WEST, NORTH]

const constructGrid = g => {
  const grid = g
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => [...r].map(c => c))

  const longestRowLength = grid.reduce((acc, cur) => Math.max(acc, cur.length), 0)

  return grid.map(r => [...r, ...THE_VOID.repeat(longestRowLength - r.length).split('')])
}

const parseInstructions = str => {
  const charArr = str.split('')
  const instructions = []
  let i = charArr.findIndex(c => isNaN(c))

  while (i >= 0) {
    const chunk = charArr.splice(0, i + 1)
    const dir = chunk.pop()
    instructions.push(parseInt(chunk.join('')))
    instructions.push(dir)
    i = charArr.findIndex(c => isNaN(c))
  }

  instructions.push(parseInt(charArr.join('')))

  return instructions
}

const getNext = (row, cur, count) => {
  let pos = cur
  let loopCt = 0
  const firstOpenIndex = row.findIndex(x => x === OPEN_TILE)
  const reversedIndex = [...row].reverse().findIndex(x => x === OPEN_TILE)
  const lastIndex = reversePosition(row.length, reversedIndex)
  const firstWallIndex = row.findIndex(x => x === WALL)
  const rowStartsWithWall = firstWallIndex >= 0 && firstWallIndex < firstOpenIndex

  while (loopCt < count) {
    const isLast = pos === lastIndex

    if ((isLast && rowStartsWithWall) || row[pos + 1] === WALL) {
      return pos
    }

    pos = isLast ? firstOpenIndex : pos + 1
    loopCt++
  }

  return pos
}

const turnRight = curHeading => directions[(directions.indexOf(curHeading) + 1) % directions.length]

const turnLeft = curHeading => {
  const curIndex = directions.indexOf(curHeading)
  return directions[curIndex === 0 ? directions.length - 1 : curIndex - 1]
}

const reversePosition = (len, pos) => len - 1 - pos
const getColumnArray = (grid, colNum) => grid.map(r => r[colNum])

const partA = fileName => {
  const [gridPart, directionsPart] = fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)
  const grid = constructGrid(gridPart)
  let curHeading = EAST

  let position = [0, grid[0].findIndex(x => x === OPEN_TILE)]
  const instructions = parseInstructions(directionsPart.replace(/\r?\n/, ''))

  instructions.forEach(step => {
    const [rowPos, colPos] = position
    if (typeof step === 'number') {
      if (curHeading === EAST) {
        const newCol = getNext(grid[rowPos], colPos, step)

        position = [rowPos, newCol]
      } else if (curHeading === WEST) {
        const newCol = reversePosition(
          grid[rowPos].length,
          getNext([...grid[rowPos]].reverse(), reversePosition(grid[rowPos].length, colPos), step)
        )

        position = [rowPos, newCol]
      } else if (curHeading === SOUTH) {
        const newRow = getNext(getColumnArray(grid, colPos), rowPos, step)

        position = [newRow, colPos]
      } else if (curHeading === NORTH) {
        const reversedArr = [...getColumnArray(grid, colPos)].reverse()
        const newRow = reversePosition(
          reversedArr.length,
          getNext(reversedArr, reversePosition(reversedArr.length, rowPos), step)
        )

        position = [newRow, colPos]
      }
    } else if (step === 'R') {
      curHeading = turnRight(curHeading)
    } else if (step === 'L') {
      curHeading = turnLeft(curHeading)
    }
  })

  const rowVal = (position[0] + 1) * 1000
  const colVal = (position[1] + 1) * 4
  const headingVal = directions.indexOf(curHeading)
  return rowVal + colVal + headingVal
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_22/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_22/input.txt'))
}

process('A', 6032, partA)
