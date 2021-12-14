const polymerize = fileName => {
  const [rawTemplate, rawRules] = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n\n')
  const template = rawTemplate.split('')
  const rules = rawRules
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(' -> '))

  const polymer = Array.from({ length: 10 }).reduce(acc => {
    const charsToInsert = acc.reduce((tAcc, tCur, i) => {
      const rule = rules.find(([pair]) => [tCur, acc[i + 1]].join('') === pair)
      const insertChar = rule ? [i + 1, rule[1]] : []
      return [...tAcc, ...(insertChar.length > 0 ? [insertChar] : [])]
    }, [])

    return charsToInsert.reverse().reduce((cAcc, [pos, char]) => {
      return [...cAcc.slice(0, pos), char, ...cAcc.slice(pos)]
    }, acc)
  }, template)

  const counts = [...new Set(polymer)].reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: polymer.filter(p => p === cur).length
    }),
    {}
  )

  return Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = polymerize('./day_14/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, polymerize('./day_14/input.txt'))
}

process('A', 1588)
