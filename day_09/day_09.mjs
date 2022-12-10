import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(i => i.split(' '))
    .map(([dir, count]) => [dir, parseInt(count)])

const traverseRopeBridge = (fileName, knotCount) => {
  const instructions = parseInput(fileName)

  const knots = Array.from({ length: knotCount }, () => ({ x: 0, y: 0 }))
  const visitedCoordinates = [{ ...knots[knotCount - 1] }]
  const addVisit = visit => {
    if (!visitedCoordinates.some(c => c.x === visit.x && c.y === visit.y))
      visitedCoordinates.push({ ...visit })
  }

  instructions.forEach(([dir, count]) => {
    Array.from({ length: count }).forEach(() => {
      const head = knots[0]

      if (dir === 'R') head.x++
      else if (dir === 'L') head.x--
      else if (dir === 'U') head.y++
      else if (dir === 'D') head.y--

      for (let i = 1; i < knotCount; i++) {
        const [leader, me] = [knots[i - 1], knots[i]]

        if (leader.x === me.x && leader.y - me.y > 1) {
          // N
          me.y++
        } else if (
          leader.x > me.x &&
          leader.y > me.y &&
          (leader.x - me.x > 1 || leader.y - me.y > 1)
        ) {
          // NE
          me.x++
          me.y++
        } else if (leader.x - me.x > 1 && leader.y === me.y) {
          // E
          me.x++
        } else if (
          leader.x > me.x &&
          leader.y < me.y &&
          (leader.x - me.x > 1 || me.y - leader.y > 1)
        ) {
          // SE
          me.x++
          me.y--
        } else if (leader.x === me.x && me.y - leader.y > 1) {
          // S
          me.y--
        } else if (
          leader.x < me.x &&
          leader.y < me.y &&
          (me.x - leader.x > 1 || me.y - leader.y > 1)
        ) {
          // SW
          me.x--
          me.y--
        } else if (me.x - leader.x > 1 && leader.y === me.y) {
          // W
          me.x--
        } else if (
          leader.x < me.x &&
          leader.y > me.y &&
          (me.x - leader.x > 1 || leader.y - me.y > 1)
        ) {
          // NW
          me.x--
          me.y++
        }

        if (i === knotCount - 1) addVisit(me)
      }
    })
  })

  return visitedCoordinates.length
}

const process = (part, expectedAnswer, knotCount) => {
  const sampleAnswer = traverseRopeBridge('./day_09/sample_input.txt', knotCount)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, traverseRopeBridge('./day_09/input.txt', knotCount))
}

process('A', 13, 2)
process('B', 1, 10)
