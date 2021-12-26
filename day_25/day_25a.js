const swapXY = grid => grid[0].map((_, i) => grid.map(r => r[i]))

const herdsAreDifferent = (a, b) =>
  a.some((r, rI) => r.some((c, cI) => b[rI][cI] !== c))

const moveHerd = (grid, herdType) =>
  grid.reduce((acc, r) => {
    const rowHolder = [...r]

    r.forEach((c, i) => {
      const nextIndex = i === r.length - 1 ? 0 : i + 1

      if (c === herdType && r[nextIndex] === '.') {
        rowHolder[i] = '.'
        rowHolder[nextIndex] = herdType
      }
    })

    return [...acc, rowHolder]
  }, [])

const moveSeaCucumbers = fileName => {
  let seaCucumbers = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  let count = 0
  let preMoveCucumbers

  do {
    preMoveCucumbers = [...seaCucumbers]
    seaCucumbers = moveHerd(seaCucumbers, '>')
    seaCucumbers = swapXY(moveHerd(swapXY(seaCucumbers), 'v'))
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
