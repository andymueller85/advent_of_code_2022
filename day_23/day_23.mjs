import * as fs from 'fs'

class Elf {
  constructor(row, col) {
    this.row = row
    this.col = col
  }

  proposeNorth() {
    this.proposedDirection = { row: this.row - 1, col: this.col }
  }

  proposeEast() {
    this.proposedDirection = { row: this.row, col: this.col + 1 }
  }

  proposeSouth() {
    this.proposedDirection = { row: this.row + 1, col: this.col }
  }

  proposeWest() {
    this.proposedDirection = { row: this.row, col: this.col - 1 }
  }

  hasNorthNeighbor(elves) {
    return elves.some(e => e.row === this.row - 1 && e.col === this.col)
  }

  hasNorthEastNeighbor(elves) {
    return elves.some(e => e.row === this.row - 1 && e.col === this.col + 1)
  }

  hasEastNeighbor(elves) {
    return elves.some(e => e.row === this.row && e.col === this.col + 1)
  }

  hasSouthEastNeighbor(elves) {
    return elves.some(e => e.row === this.row + 1 && e.col === this.col + 1)
  }

  hasSouthNeighbor(elves) {
    return elves.some(e => e.row === this.row + 1 && e.col === this.col)
  }

  hasSouthWestNeighbor(elves) {
    return elves.some(e => e.row === this.row + 1 && e.col === this.col - 1)
  }

  hasWestNeighbor(elves) {
    return elves.some(e => e.row === this.row && e.col === this.col - 1)
  }

  hasNorthWestNeighbor(elves) {
    return elves.some(e => e.row === this.row - 1 && e.col === this.col - 1)
  }

  hasNeighbors(elves) {
    return (
      this.hasNorthNeighbor(elves) ||
      this.hasNorthEastNeighbor(elves) ||
      this.hasEastNeighbor(elves) ||
      this.hasSouthEastNeighbor(elves) ||
      this.hasSouthNeighbor(elves) ||
      this.hasSouthWestNeighbor(elves) ||
      this.hasWestNeighbor(elves) ||
      this.hasNorthWestNeighbor(elves)
    )
  }

  hasProposedDirection() {
    return this.proposedDirection !== undefined
  }

  proposedDirectionUnique(elves) {
    return !elves
      .filter(e => !(e.row === this.row && e.col === this.col))
      .some(
        other =>
          other.proposedDirection?.row === this.proposedDirection.row &&
          other.proposedDirection?.col === this.proposedDirection.col
      )
  }

  moveToProposedDirection() {
    this.row = this.proposedDirection.row
    this.col = this.proposedDirection.col
  }

  clearProposedDirection() {
    this.proposedDirection = undefined
  }
}

const NORTH = 'N'
const SOUTH = 'S'
const WEST = 'W'
const EAST = 'E'

const initializeDirections = () => [NORTH, SOUTH, WEST, EAST]

const countNonElves = elves => {
  const boundaries = elves.reduce(
    (acc, cur) => ({
      n: Math.min(acc.n, cur.row),
      s: Math.max(acc.s, cur.row),
      e: Math.max(acc.e, cur.col),
      w: Math.min(acc.w, cur.col)
    }),
    {
      n: Number.MAX_SAFE_INTEGER,
      s: Number.MIN_SAFE_INTEGER,
      e: Number.MIN_SAFE_INTEGER,
      w: Number.MAX_SAFE_INTEGER
    }
  )

  let count = 0

  for (let r = boundaries.n; r <= boundaries.s; r++) {
    for (let c = boundaries.w; c <= boundaries.e; c++) {
      const isElf = elves.some(e => e.row === r && e.col === c)
      if (!isElf) {
        count++
      }
    }
  }

  return count
}

const parseInput = fileName => {
  let elves = []

  fs.readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .forEach((r, rIndex) => {
      r.split('').forEach((c, cIndex) => {
        if (c === '#') {
          elves.push(new Elf(rIndex, cIndex))
        }
      })
    })

  return elves
}

const proposeMoves = (elves, directions) => {
  elves.forEach(e => {
    if (e.hasNeighbors(elves) && !e.hasProposedDirection()) {
      directions.forEach(d => {
        if (!e.hasProposedDirection()) {
          switch (d) {
            case NORTH:
              if (
                !e.hasNorthNeighbor(elves) &&
                !e.hasNorthEastNeighbor(elves) &&
                !e.hasNorthWestNeighbor(elves)
              ) {
                e.proposeNorth()
              }
              break
            case SOUTH:
              if (
                !e.hasSouthNeighbor(elves) &&
                !e.hasSouthEastNeighbor(elves) &&
                !e.hasSouthWestNeighbor(elves)
              ) {
                e.proposeSouth()
              }
              break
            case WEST:
              if (
                !e.hasWestNeighbor(elves) &&
                !e.hasNorthWestNeighbor(elves) &&
                !e.hasSouthWestNeighbor(elves)
              ) {
                e.proposeWest()
              }
              break
            case EAST:
              if (
                !e.hasEastNeighbor(elves) &&
                !e.hasNorthEastNeighbor(elves) &&
                !e.hasSouthEastNeighbor(elves)
              ) {
                e.proposeEast()
              }
              break
          }
        }
      })
    }
  })
}

const moveElves = elves => {
  return elves.reduce((acc, e) => {
    if (e.hasProposedDirection()) {
      if (e.proposedDirectionUnique(elves)) {
        e.moveToProposedDirection()
        return true
      }
    }
    return acc
  }, false)
}

const partA = fileName => {
  const directions = initializeDirections()
  const elves = parseInput(fileName)

  Array.from({ length: 10 }).forEach(() => {
    proposeMoves(elves, directions)
    moveElves(elves)

    elves.forEach(e => e.clearProposedDirection())
    directions.push(directions.shift())
  })

  return countNonElves(elves)
}

const partB = fileName => {
  const directions = initializeDirections()
  const elves = parseInput(fileName)
  let someElfMoved = false
  let turnCount = 0

  while (turnCount === 0 || someElfMoved) {
    turnCount++
    proposeMoves(elves, directions)
    someElfMoved = moveElves(elves)

    elves.forEach(e => e.clearProposedDirection())
    directions.push(directions.shift())
  }

  return turnCount
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_23/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_23/input.txt'))
}

process('A', 110, partA)
process('B', 20, partB)
