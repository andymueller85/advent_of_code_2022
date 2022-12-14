import * as fs from 'fs'
const GRID_SIZE = 1000
const AIR = '.'
const ROCK = '#'
const SAND = 'o'

const partA = fileName => {
  const input = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(l => l.split(' -> ').map(c => c.split(',')))

  const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => '.'))

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

  let keepGoing = true
  let sandCount = 0

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

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_14/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_14/input.txt'))
}

process('A', 24, partA)
