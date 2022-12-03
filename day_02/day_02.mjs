import * as fs from 'fs'

const instructionLookup = {
  X: { name: 'beats', points: 0 },
  Y: { name: 'ties', points: 3 },
  Z: { name: 'losesTo', points: 6 }
}

const lookup = {
  A: { beats: 'Z', losesTo: 'Y', ties: 'X', points: 1, name: 'rock' },
  B: { beats: 'X', losesTo: 'Z', ties: 'Y', points: 2, name: 'paper' },
  C: { beats: 'Y', losesTo: 'X', ties: 'Z', points: 3, name: 'scissors' },
  X: { beats: 'C', losesTo: 'B', ties: 'A', points: 1, name: 'rock' },
  Y: { beats: 'A', losesTo: 'C', ties: 'B', points: 2, name: 'paper' },
  Z: { beats: 'B', losesTo: 'A', ties: 'C', points: 3, name: 'scissors' }
}

const getTurnScoreA = ([oppponent, me]) =>
  lookup[oppponent].points + instructionLookup[me].points


const getTurnScoreB = ([oppponent, instruction]) => {
  const { points, name } = instructionLookup[instruction]
  return points + lookup[lookup[oppponent][name]].points
}

const playPRS = (fileName, turnScoreFn) =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(turn => turn.split(' '))
    .reduce((acc, cur) => acc + turnScoreFn(cur), 0)

const process = (part, expectedAnswer, turnScoreFn) => {
  const sampleAnswer = playPRS('./day_02/sample_input.txt', turnScoreFn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    playPRS('./day_02/input.txt', turnScoreFn)
  )
}

process('A', 15, getTurnScoreA)
process('B', 12, getTurnScoreB)
