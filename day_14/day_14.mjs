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
    const floorIndex = grid.reduce((acc, cur, i) => (cur.includes(ROCK) ? i + 2 : acc), 0)
    grid[floorIndex] = grid[floorIndex].map(() => ROCK)
  }

  return grid
}

const continueFnA = (_, sandX, limit) => sandX < limit
const continueFnB = entrance => entrance === AIR

const dropSand = (grid, continueFn) => {
  let sandCount = 0
  let sandX = 0
  let sandY = 500
  while (continueFn(grid[0][500], sandX, GRID_SIZE - 1)) {
    sandX = 0
    sandY = 500
    let falling = true
    while (falling) {
      if (sandX === GRID_SIZE - 1) {
        falling = false
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

const main = (fileName, continueFn, floor) => {
  const input = processInput(fileName)
  const grid = createGrid()
  const gridWithRocks = placeRocks(input, grid, floor)

  return dropSand(gridWithRocks, continueFn)
}

const process = (part, expectedAnswer, continueFn, floor) => {
  const sampleAnswer = main('./day_14/sample_input.txt', continueFn, floor)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, main('./day_14/input.txt', continueFn, floor))
}

process('A', 24, continueFnA, false)
process('B', 93, continueFnB, true)
