const input = require('fs')
  .readFileSync('./day_04/input.txt', 'utf8')
  .split('\n\n')
  .filter(d => d)

const numbersDraw = input[0].split(',')

const boards = input.slice(1).map(b =>
  b
    .split('\n')
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
  let foundCol = -1
  const foundRow = board.reduce((acc, curRow, i) => {
    if (acc >= 0) return acc

    foundCol = acc >= 0 ? acc : curRow.findIndex(r => r.num === drawnNumber)
    return foundCol === -1 ? -1 : i
  }, -1)

  return foundRow >= 0 && foundCol >= 0
    ? board.map((r, i) => (i === foundRow ? markAtIndex(r, foundCol) : r))
    : board
}

const isWinner = board => {
  const swapXY = board =>
    Array.from({ length: boards[0][0].length }, (_, i) => i).map(c =>
      board.map(r => r[c])
    )
  const rowIsComplete = r => r.every(n => n.marked)

  return board.some(rowIsComplete) || swapXY(board).some(rowIsComplete)
}

const declareWinner = (board, lastCalledNumber) => {
  const sumUnmarkedNums = board.reduce((acc, curRow) => {
    return (
      acc +
      curRow.reduce((innerAcc, curNum) => {
        return innerAcc + (curNum.marked ? 0 : parseInt(curNum.num, 10))
      }, 0)
    )
  }, 0)

  console.log({ sumUnmarkedNums, lastCalledNumber })
  console.log('answer', sumUnmarkedNums * parseInt(lastCalledNumber, 10))
}

const playBingo = (currentBoards, calledNumberIndex = 0) => {
  const markedBoards = currentBoards.map(b =>
    markBoard(b, numbersDraw[calledNumberIndex])
  )
  const winningBoard = markedBoards.find(isWinner)

  if (winningBoard) {
    declareWinner(winningBoard, numbersDraw[calledNumberIndex])
  } else {
    playBingo(markedBoards, calledNumberIndex + 1)
  }
}

playBingo(boards)
