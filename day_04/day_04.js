const input = require('fs')
  .readFileSync('./day_04/input.txt', 'utf8')
  .split('\n\n')
  .filter(d => d)
const bingoNumbers = input[0].split(',')
const boards = input.slice(1).map(b =>
  b
    .split(/\r?\n/)
    .map(r =>
      r
        .split(' ')
        .filter(n => n)
        .map(n => ({ num: n, marked: false }))
    )
    .filter(r => r.length > 0)
)

const markBoard = (board, drawnNumber) => {
  const markAtIndex = (arr, i) => [
    ...arr.slice(0, i),
    { ...arr[i], marked: true },
    ...arr.slice(i + 1)
  ]
  const numberMatch = ({ num }) => num === drawnNumber
  const foundRow = board.findIndex(r => r.some(numberMatch))
  const foundCol = foundRow >= 0 ? board[foundRow].findIndex(numberMatch) : -1

  return foundRow >= 0 && foundCol >= 0
    ? board.map((r, i) => (i === foundRow ? markAtIndex(r, foundCol) : r))
    : board
}

const swapXY = board =>
  Array.from({ length: boards[0][0].length }, (_, i) => i).map(c =>
    board.map(r => r[c])
  )

const rowIsComplete = r => r.every(({ marked }) => marked)

const isWinner = board =>
  board.some(rowIsComplete) || swapXY(board).some(rowIsComplete)

const declareWinner = (board, lastCalledNumber) => {
  const sumUnmarkedNums = board
    .flat()
    .reduce((acc, { marked, num }) => acc + (marked ? 0 : parseInt(num, 10)), 0)

  console.log({ sumUnmarkedNums, lastCalledNumber })
  console.log('answer', sumUnmarkedNums * parseInt(lastCalledNumber, 10))
  console.log('')
}

const clearBoards = (myBoards, indecies) => {
  const boardsClone = [...myBoards]

  indecies.reverse().forEach(i => boardsClone.splice(i, 1))

  return boardsClone
}

const playBingo = (currentBoards, calledNumberIndex = 0) => {
  const markedBoards = currentBoards.map(b =>
    markBoard(b, bingoNumbers[calledNumberIndex])
  )
  const winningBoard = markedBoards.find(isWinner)

  if (winningBoard) {
    console.log('I won!!')
    declareWinner(winningBoard, bingoNumbers[calledNumberIndex])
  } else {
    playBingo(markedBoards, calledNumberIndex + 1)
  }
}

const letTheSquidWin = (currentBoards, calledNumberIndex = 0) => {
  const markedBoards = currentBoards.map(b =>
    markBoard(b, bingoNumbers[calledNumberIndex])
  )
  const winningBoardIndecies = markedBoards
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => isWinner(b))
    .map(({ i }) => i)

  const remainingBoards =
    markedBoards.length > 1
      ? clearBoards(markedBoards, winningBoardIndecies)
      : markedBoards

  if (
    currentBoards.length === 1 &&
    remainingBoards.length === 1 &&
    winningBoardIndecies.length === 1
  ) {
    console.log('The Squid Won!!')
    declareWinner(remainingBoards[0], bingoNumbers[calledNumberIndex])
  } else {
    letTheSquidWin(remainingBoards, calledNumberIndex + 1)
  }
}

playBingo(boards)
letTheSquidWin(boards)
