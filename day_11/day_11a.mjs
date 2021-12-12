import * as fs from 'fs'

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

    return neighbors.filter(([r, c]) => r > -1 && r < 10 && c > -1 && c < 10)
  }

  increaseEnergy() {
    this._energyLevel++
  }
}

const energizeNeighbors = (octopus, octoGrid) => {
  octopus.neighbors.forEach(([r, c]) => {
    const octoNeighbor = octoGrid[r][c]

    octoNeighbor.increaseEnergy()

    if (
      !octoNeighbor.flashed &&
      octoNeighbor.energyLevel > octoGrid[0].length - 1
    ) {
      octoNeighbor.flashed = true
      energizeNeighbors(octoNeighbor, octoGrid)
    }
  })
}

const getFlashCount = octoGrid => {
  const flatOctoGrid = octoGrid.flat()

  flatOctoGrid.forEach(o => {
    o.increaseEnergy()
  })

  flatOctoGrid.forEach(o => {
    if (!o.flashed && o.energyLevel > octoGrid[0].length - 1) {
      o.flashed = true
      energizeNeighbors(o, octoGrid)
    }
  })

  const { length } = flatOctoGrid.filter(o => o.flashed)

  flatOctoGrid.forEach(o => {
    if (o.flashed) o.energyLevel = 0
    o.flashed = false
  })

  return length
}

const processInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map((r, rIdx) =>
      r.split('').map((o, cIdx) => new Octopus(parseInt(o, 10), rIdx, cIdx))
    )

const energizeOctopuses = fileName => {
  const octoGrid = processInput(fileName)

  return Array.from({ length: 100 }).reduce(
    acc => acc + getFlashCount(octoGrid),
    0
  )
}

const findOctoSynchronizationIndex = fileName => {
  const octoGrid = processInput(fileName)
  let step = 1
  while (getFlashCount(octoGrid) !== octoGrid.flat().length) step++
  return step
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_11/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_11/input.txt'))
}

process('A', 1656, energizeOctopuses)
process('B', 195, findOctoSynchronizationIndex)
