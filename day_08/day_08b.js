const decodeDigits = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(d => d.split(' | '))
    .map(([pattern, output]) => ({
      patterns: pattern.split(' ').map(p => p.split('')),
      output: output.split(' ')
    }))

  const removeAll = (originalSet, toBeRemovedSet) => {
    const originalSetClone = new Set([...originalSet])
    ;[...toBeRemovedSet].forEach(v => {
      originalSetClone.delete(v)
    })
    return originalSetClone
  }

  return input.reduce((acc, i) => {
    const one = i.patterns.find(p => p.length === 2).sort()
    const four = i.patterns.find(p => p.length === 4).sort()
    const seven = i.patterns.find(p => p.length === 3).sort()
    const eight = i.patterns.find(p => p.length === 7).sort()
    const nine = i.patterns
      .find(
        p =>
          p.length === 6 &&
          [...removeAll(new Set(p), new Set([...four, ...seven]))].length === 1
      )
      .sort()
    const six = i.patterns
      .find(
        p =>
          p.length === 6 &&
          [...removeAll(new Set(one), new Set(p))].length === 1
      )
      .sort()
    const zero = i.patterns
      .find(
        p =>
          p.length === 6 && ![nine.join(''), six.join('')].includes(p.join(''))
      )
      .sort()
    const three = i.patterns
      .find(
        p =>
          p.length === 5 &&
          [...removeAll(new Set(seven), new Set(p))].length === 0
      )
      .sort()
    const two = i.patterns
      .find(p => p.length === 5 && [...new Set([...four, ...p])].length === 7)
      .sort()
    const five = i.patterns
      .find(
        p =>
          p.length === 5 && ![three.join(''), two.join('')].includes(p.join(''))
      )
      .sort()

    const getNumericalVal = codedNum => {
      switch (codedNum) {
        case zero.join(''):
          return '0'
        case one.join(''):
          return '1'
        case two.join(''):
          return '2'
        case three.join(''):
          return '3'
        case four.join(''):
          return '4'
        case five.join(''):
          return '5'
        case six.join(''):
          return '6'
        case seven.join(''):
          return '7'
        case eight.join(''):
          return '8'
        case nine.join(''):
          return '9'
      }
    }

    return (
      acc +
      parseInt(
        i.output.reduce(
          (innerAcc, cur) =>
            innerAcc + getNumericalVal(cur.split('').sort().join('')),
          ''
        ),
        10
      )
    )
  }, 0)
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = decodeDigits('./day_08/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, decodeDigits('./day_08/input.txt'))
}

process('B', 61229)
