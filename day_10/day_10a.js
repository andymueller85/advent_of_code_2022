const getSyntaxErrorScore = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  const openers = ['(', '[', '{', '<']
  const closers = [')', ']', '}', '>']

  const isMatch = (opener, closer) =>
    openers.findIndex(o => o === opener) ===
    closers.findIndex(c => c === closer)

  const getScore = char => {
    switch (char) {
      case ')':
        return 3
      case ']':
        return 57
      case '}':
        return 1197
      case '>':
        return 25137
    }
  }

  return input.reduce((acc, cur) => {
    const stack = []
    const invalid = cur.find(char => {
      if (!openers.includes(char)) {
        return !isMatch(stack.pop(), char)
      }
      stack.push(char)
    })

    return acc + (invalid ? getScore(invalid) : 0)
  }, 0)
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = getSyntaxErrorScore('./day_10/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(
    `part ${part} real answer`,
    getSyntaxErrorScore('./day_10/input.txt')
  )
}

process('A', 26397)
