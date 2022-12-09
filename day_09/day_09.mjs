import * as fs from 'fs'

const partA = fileName => {
  const instructions = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(i => i.split(' '))
    .map(([dir, count]) => [dir, parseInt(count)])

  const head = { x: 0, y: 0 }
  const tail = { x: 0, y: 0 }

  const visitedCoordinates = [{ ...tail }]

  const addVisit = visit => {
    if (!visitedCoordinates.some(c => c.x === visit.x && c.y === visit.y))
      visitedCoordinates.push({ ...visit })
  }

  instructions.forEach(([dir, count]) => {
    Array.from({ length: count }).forEach(() => {
      // move head
      switch (dir) {
        case 'R':
          head.x++
          break
        case 'L':
          head.x--
          break
        case 'U':
          head.y++
          break
        case 'D':
          head.y--
          break
      }

      // move tail
      if (head.x === tail.x && head.y === tail.y) {
        // do nothing - actually a lot of cases here. just remove this case.
      } else if (head.x === tail.x && head.y - tail.y > 1) {
        // move north
        tail.y++
      } else if (
        head.x > tail.x &&
        head.y > tail.y &&
        (head.x - tail.x > 1 || head.y - tail.y > 1)
      ) {
        // move NE
        tail.x++
        tail.y++
      } else if (head.x - tail.x > 1 && head.y === tail.y) {
        // move east
        tail.x++
      } else if (
        head.x > tail.x &&
        head.y < tail.y &&
        (head.x - tail.x > 1 || tail.y - head.y > 1)
      ) {
        // move SE
        tail.x++
        tail.y--
      } else if (head.x === tail.x && tail.y - head.y > 1) {
        // move south
        tail.y--
      } else if (
        head.x < tail.x &&
        head.y < tail.y &&
        (tail.x - head.x > 1 || tail.y - head.y > 1)
      ) {
        // move SW
        tail.x--
        tail.y--
      } else if (tail.x - head.x > 1 && head.y === tail.y) {
        // move west
        tail.x--
      } else if (
        head.x < tail.x &&
        head.y > tail.y &&
        (tail.x - head.x > 1 || head.y - tail.y > 1)
      ) {
        // move NW
        tail.x--
        tail.y++
      }

      addVisit(tail)
    })
  })

  return visitedCoordinates.length
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_09/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_09/input.txt'))
}

process('A', 13, partA)
