import * as fs from 'fs'
const ROW_LENGTH = 10

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
    const arr = Array.from({ length: 3 }, (_, i) => i - 1)

    return arr
      .flatMap(r =>
        arr
          .map(c => [this._row + r, this._col + c])
          .filter(([row, col]) => !(this._row === row && this._col === col))
      )
      .filter(([r, c]) => r > -1 && r < ROW_LENGTH && c > -1 && c < ROW_LENGTH)
  }

  reset() {
    if (this._flashed) this._energyLevel = 0
    this._flashed = false
  }
}

const processInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map((r, rIdx) =>
      r.split('').map((o, cIdx) => new Octopus(parseInt(o, 10), rIdx, cIdx))
    )

const increaseEnergy = (octopus, octoGrid) => {
  octopus.energyLevel++

  if (!octopus.flashed && octopus.energyLevel > 9) {
    octopus.flashed = true
    octopus.neighbors.forEach(([r, c]) =>
      increaseEnergy(octoGrid[r][c], octoGrid)
    )
  }
}

const octoStep = octoGrid => {
  octoGrid.flat().forEach(o => increaseEnergy(o, octoGrid))

  return octoGrid.flat().filter(o => o.flashed).length
}

const energizeOctopuses = fileName => {
  const octoGrid = processInput(fileName)

  return Array.from({ length: 100 }).reduce(acc => {
    const flashCount = octoStep(octoGrid)

    octoGrid.flat().forEach(o => o.reset())

    return acc + flashCount
  }, 0)
}

const findOctoSynchronizationIndex = fileName => {
  const octoGrid = processInput(fileName)
  let step = 1

  while (octoStep(octoGrid) !== octoGrid.flat().length) {
    octoGrid.flat().forEach(o => o.reset())
    step++
  }

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
