const moveSeaCucumbers = fileName => {
  let seaCucumbers = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  const swapXY = grid =>
    grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))

  const nextIndex = (i, length) => (i === length - 1 ? 0 : i + 1)

  const herdsAreDifferent = (a, b) =>
    a.some((r, rI) => r.some((c, cI) => b[rI][cI] !== c))

  const moveHerd = (grid, herdType) =>
    grid.reduce((acc, r) => {
      const rowHolder = [...r]

      r.forEach((c, i) => {
        if (c === herdType && r[nextIndex(i, r.length)] === '.') {
          rowHolder[i] = '.'
          rowHolder[nextIndex(i, r.length)] = herdType
        }
      })

      return [...acc, rowHolder]
    }, [])

  let count = 0
  let preMoveCucumbers

  do {
    preMoveCucumbers = [...seaCucumbers]
    seaCucumbers = swapXY(moveHerd(swapXY(moveHerd(seaCucumbers, '>')), 'v'))
    count++
  } while (herdsAreDifferent(seaCucumbers, preMoveCucumbers))

  return count
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = moveSeaCucumbers('./day_25/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(
    `part ${part} real answer`,
    moveSeaCucumbers('./day_25/input.txt')
  )
}

process('A', 58)
