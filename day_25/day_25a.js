const moveSeaCucumbers = fileName => {
  let seaCucumbers = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  const GRID_WIDTH = seaCucumbers[0].length
  const GRID_HEIGHT = seaCucumbers.length

  const swapXY = grid =>
    grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))

  const nextIndex = (i, length) => (i === length - 1 ? 0 : i + 1)

  const moveHerd = (grid, herdType, length) => {
    let updatedGrid = []
    grid.forEach(r => {
      let tempRow = [...r]

      r.forEach((c, cI) => {
        if (c === herdType && r[nextIndex(cI, length)] === '.') {
          tempRow[cI] = '.'
          tempRow[nextIndex(cI, length)] = herdType
        }
      })

      updatedGrid.push(tempRow)
    })

    return updatedGrid
  }

  let shouldContinue = true
  let count = 0

  while (shouldContinue) {
    const preMoveCucumbers = [...seaCucumbers]
    seaCucumbers = moveHerd(seaCucumbers, '>', GRID_WIDTH)
    seaCucumbers = swapXY(moveHerd(swapXY(seaCucumbers), 'v', GRID_HEIGHT))
    shouldContinue = seaCucumbers.some((r, rI) =>
      r.some((c, cI) => preMoveCucumbers[rI][cI] !== c)
    )

    count++
  }

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
