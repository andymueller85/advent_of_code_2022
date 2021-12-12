import * as fs from 'fs'

const GRID_SIZE = 10

class Octopus {
  constructor(energyLevel, row, col) {
    this._energyLevel = energyLevel
    this._row = row
    this._col = col
    this._flashed = false
  }

  get energyLevel() {
    return this._energyLevel
  }

  set energyLevel(e) {
    this._energyLevel = e
  }

  get flashed() {
    return this._flashed
  }

  set flashed(val) {
    this._flashed = val
  }

  get neighbors() {
    let neighbors = [
      [this._row - 1, this._col - 1],
      [this._row - 1, this._col],
      [this._row - 1, this._col + 1],
      [this._row, this._col - 1],
      [this._row, this._col + 1],
      [this._row + 1, this._col - 1],
      [this._row + 1, this._col],
      [this._row + 1, this._col + 1]
    ]

    return neighbors.filter(
      ([r, c]) => r > -1 && r < GRID_SIZE && c > -1 && c < GRID_SIZE
    )
  }

  increaseEnergy() {
    this._energyLevel++
  }
}

const energizeOctopuses = fileName => {
  const octoGrid = fs
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map((r, rIdx) =>
      r.split('').map((o, cIdx) => new Octopus(parseInt(o, 10), rIdx, cIdx))
    )

  const energizeNeighbors = octopus => {
    if (octopus.energyLevel > 9) {
      octopus.neighbors.forEach(([r, c]) => {
        const octoNeighbor = octoGrid[r][c]

        octoNeighbor.increaseEnergy()

        if (!octoNeighbor.flashed && octoNeighbor.energyLevel > 9) {
          octoNeighbor.flashed = true
          energizeNeighbors(octoNeighbor)
        }
      })
    }
  }

  return Array.from({ length: 100 }).reduce(acc => {
    const flatOctoGrid = octoGrid.flat()
    flatOctoGrid.forEach(o => {
      o.increaseEnergy()
    })
    flatOctoGrid.forEach(o => {
      if (!o.flashed && o.energyLevel > 9) {
        o.flashed = true
        energizeNeighbors(o)
      }
    })
    const flashCount = flatOctoGrid.filter(o => o.flashed).length

    flatOctoGrid.forEach(o => {
      if (o.flashed) o.energyLevel = 0
      o.flashed = false
    })

    return acc + flashCount
  }, 0)
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = energizeOctopuses('./day_11/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    energizeOctopuses('./day_11/input.txt')
  )
}

process('A', 1656)
