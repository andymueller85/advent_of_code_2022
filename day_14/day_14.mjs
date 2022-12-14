import * as fs from 'fs'
const GRID_SIZE = 1000
const AIR = '.'
const ROCK = '#'
const SAND = 'o'

const processInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(' -> ').map(c => c.split(',')))

const createGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => '.'))

const placeRocks = (input, grid, floor) => {
  input.forEach(line => {
    line.forEach(([x, y], i) => {
      if (line[i + 1]) {
        if (x === line[i + 1][0]) {
          // vertical
          const low = Math.min(y, line[i + 1][1])
          const high = Math.max(y, line[i + 1][1])
          for (let j = low; j <= high; j++) {
            grid[j][x] = ROCK
          }
        } else {
          // horizontal
          const low = Math.min(x, line[i + 1][0])
          const high = Math.max(x, line[i + 1][0])
          for (let j = low; j <= high; j++) {
            grid[y][j] = ROCK
          }
        }
      }
    })
  })

  if (floor) {
    const floorIndex = grid.reduce((acc, cur, i) => {
      if (cur.includes(ROCK)) {
        return i + 2
      }
      return acc
    }, 0)

    console.log(floorIndex)
    grid[floorIndex] = grid[floorIndex].map(() => ROCK)
  }

  return grid
}

const partA = grid => {
  let sandCount = 0
  let keepGoing = true
  while (keepGoing) {
    let sandX = 0
    let sandY = 500
    let falling = true
    while (falling) {
      if (sandX === GRID_SIZE - 1) {
        falling = false
        keepGoing = false
      } else if (grid[sandX + 1][sandY] === AIR) {
        // fall straight down
        sandX++
      } else if ([ROCK, SAND].includes(grid[sandX + 1][sandY])) {
        if (grid[sandX + 1][sandY - 1] === AIR) {
          // down & left
          sandY--
          sandX++
        } else if (grid[sandX + 1][sandY + 1] === AIR) {
          // down & right
          sandY++
          sandX++
        } else {
          // come to rest
          grid[sandX][sandY] = SAND
          falling = false
          sandCount++
        }
      }
    }
  }

  return sandCount
}

const partB = grid => {
  let sandCount = 0
  let keepGoing = true
  while (grid[0][500] === AIR) {
    let sandX = 0
    let sandY = 500
    let falling = true
    while (falling) {
      if (sandX === GRID_SIZE - 1) {
        falling = false
        keepGoing = false
      } else if (grid[sandX + 1][sandY] === AIR) {
        // fall straight down
        sandX++
      } else if ([ROCK, SAND].includes(grid[sandX + 1][sandY])) {
        if (grid[sandX + 1][sandY - 1] === AIR) {
          // down & left
          sandY--
          sandX++
        } else if (grid[sandX + 1][sandY + 1] === AIR) {
          // down & right
          sandY++
          sandX++
        } else {
          // come to rest
          grid[sandX][sandY] = SAND
          falling = false
          sandCount++
        }
      }
    }
  }

  return sandCount
}

const main = (fileName, fn, floor) => {
  const input = processInput(fileName)
  const grid = createGrid()
  const gridWithRocks = placeRocks(input, grid, floor)

  return fn(gridWithRocks)
}

const process = (part, expectedAnswer, fn, floor) => {
  const sampleAnswer = main('./day_14/sample_input.txt', fn, floor)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, main('./day_14/input.txt', fn, floor))
}

process('A', 24, partA, false)
process('B', 93, partB, true)
