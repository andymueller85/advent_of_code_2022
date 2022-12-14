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
  Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => AIR))

const placeRocks = (input, grid, floor) => {
  input.forEach(point => {
    point.forEach(([x, y], i) => {
      if (point[i + 1]) {
        if (x === point[i + 1][0]) {
          // vertical
          for (let j = Math.min(y, point[i + 1][1]); j <= Math.max(y, point[i + 1][1]); j++) {
            grid[j][x] = ROCK
          }
        } else {
          // horizontal
          for (let j = Math.min(x, point[i + 1][0]); j <= Math.max(x, point[i + 1][0]); j++) {
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

const continueFnA = (_, y) => y < GRID_SIZE - 1
const continueFnB = entrance => entrance === AIR

const dropSand = (grid, continueFn) => {
  let sandCount = 0
  let y = 0
  while (continueFn(grid[0][500], y)) {
    y = 0
    let x = 500
    while (y !== GRID_SIZE - 1 && grid[y][x] !== SAND) {
      if (grid[y + 1][x] === AIR) {
        // fall straight down
        y++
      } else if ([ROCK, SAND].includes(grid[y + 1][x])) {
        if (grid[y + 1][x - 1] === AIR) {
          // down & left
          x--
          y++
        } else if (grid[y + 1][x + 1] === AIR) {
          // down & right
          x++
          y++
        } else {
          // come to rest
          grid[y][x] = SAND
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
