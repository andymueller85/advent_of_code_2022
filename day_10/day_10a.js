const openers = ['(', '[', '{', '<']
const closers = { [')']: 3, [']']: 57, ['}']: 1197, ['>']: 25137 }

const isMatch = (opener, closer) =>
  openers.findIndex(o => o === opener) ===
  Object.keys(closers).findIndex(c => c === closer)

const getSyntaxErrorScore = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  return input.reduce((acc, cur) => {
    const stack = []
    const invalid = cur.find(char => {
      if (Object.keys(closers).includes(char)) {
        return !isMatch(stack.pop(), char)
      }
      stack.push(char)
    })

    return acc + (invalid ? closers[invalid] : 0)
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
