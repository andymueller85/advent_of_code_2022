const playGame = fileName => {
  let [player1Position, player2Position] = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter(d => d)
    .map(d => parseInt(d.split(': ')[1], 10))

  let diceRoll = 0
  let player1Score = 0
  let player2Score = 0
  let player1Turn = true

  const movePiece = (currentPosition, roll) => {
    const mod = (currentPosition + roll) % 10
    return mod === 0 ? 10 : mod
  }

  while (player1Score < 1000 && player2Score < 1000) {
    const turnRoll = diceRoll * 3 + 6

    if (player1Turn) {
      player1Position = movePiece(player1Position, turnRoll)
      player1Score += player1Position
    } else {
      player2Position = movePiece(player2Position, turnRoll)
      player2Score += player2Position
    }

    diceRoll += 3
    player1Turn = !player1Turn
  }

  return diceRoll * Math.min(player1Score, player2Score)
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = playGame('./day_21/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, playGame('./day_21/input.txt'))
}

process('A', 739785)
