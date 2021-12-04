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

const allRowIndecies = Array.from({ length: boards[0][0].length }, (_, i) => i)

const swapXY = board => allRowIndecies.map(c => board.map(r => r[c]))
const rowIsComplete = r => r.every(n => n.marked)

const markBoard = (board, drawnNumber) => {
  let cIdx = -1
  const rIdx = board.reduce((acc, curRow, i) => {
    if (acc >= 0) return acc

    cIdx = acc >= 0 ? acc : curRow.findIndex(r => r.num === drawnNumber)
    return cIdx === -1 ? -1 : i
  }, -1)

  return rIdx >= 0 && cIdx >= 0
    ? board.map((r, i) => {
        return i === rIdx
          ? [
              ...r.slice(0, cIdx),
              { ...r[cIdx], marked: true },
              ...r.slice(cIdx + 1)
            ]
          : r
      })
    : board
}

const isWinner = board => {
  const rowWinner = board.some(rowIsComplete)
  const columnWinner = swapXY(board).some(rowIsComplete)
  // const diagonalWinner =
  //   allRowIndecies.every(i => board[i][i].marked) ||
  //   allRowIndecies.every(i => board[i][allRowIndecies.length - i - 1].marked)

  return rowWinner || columnWinner
}

const drawNumbers = (rBoards, calledNumberIndex = 0) => {
  const markedBoards = rBoards.map(b =>
    markBoard(b, numbersDraw[calledNumberIndex])
  )

  const markedNumbers = markedBoards
    .map(b => b.map(r => r.filter(c => c.marked).map(c => c.num)))
    .flat()
    .flat()

  const winningBoard = markedBoards.find(isWinner)

  if (winningBoard) {
    const sumUnmarkedNums = winningBoard.reduce((acc, curRow) => {
      return (
        acc +
        curRow.reduce((innerAcc, curNum) => {
          return innerAcc + (curNum.marked ? 0 : parseInt(curNum.num))
        }, 0)
      )
    }, 0)

    console.log({
      sumUnmarkedNums,
      lastCalledNumber: numbersDraw[calledNumberIndex]
    })
    console.log('answer', sumUnmarkedNums * numbersDraw[calledNumberIndex])
  } else {
    drawNumbers(markedBoards, calledNumberIndex + 1)
  }
}

drawNumbers(boards)
