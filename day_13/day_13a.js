const swapXY = paper =>
  paper[0].map((_, colIndex) => paper.map(row => row[colIndex]))

const foldHorizontal = (paper, foldIndex) => {
  const topIsLarger = foldIndex > paper.length / 2
  const adjustedPaper = topIsLarger ? paper : paper.reverse()
  const top = adjustedPaper.slice(0, foldIndex)
  const bottom = adjustedPaper.slice(foldIndex + 1)

  return top
    .reverse()
    .map((r, rIdx) =>
      r.map((c, cIdx) => (c === '#' || bottom[rIdx][cIdx] === '#' ? '#' : '.'))
    )
    .reverse()
}

const foldManual = fileName => {
  const [rawDots, rawInstructions] = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n\n')

  const dots = rawDots
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => d.split(',').map(c => parseInt(c, 10)))

  const maxX = Math.max(...dots.map(d => d[0])) + 1
  const maxY = Math.max(...dots.map(d => d[1])) + 1

  const paper = Array.from({ length: maxY }, (_, rIdx) =>
    Array.from({ length: maxX }, (__, cIdx) =>
      dots.find(([c, r]) => c === cIdx && r === rIdx) ? '#' : '.'
    )
  )

  const instructions = rawInstructions
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => d.split('='))
    .map(([axis, val]) => [axis.charAt(axis.length - 1), parseInt(val, 10)])

  return [instructions[0]].reduce((acc, [axis, foldIndex]) => {
    const foldedPaper =
      axis === 'y'
        ? foldHorizontal(paper, foldIndex)
        : swapXY(foldHorizontal(swapXY(paper), foldIndex))

    return acc + foldedPaper.flat().filter(d => d === '#').length
  }, 0)
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = foldManual('./day_13/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, foldManual('./day_13/input.txt'))
}

process('A', 17)
