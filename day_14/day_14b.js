const polymerize = (fileName, days) => {
  const [rawTemplate, rawRules] = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n\n')
  const template = rawTemplate.split('')
  const rules = rawRules
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split(' -> '))
  const pairs = rules.map(([pair]) => pair)

  // object that keeps track of the count of each unique character
  let charCounts = [...new Set(template)].reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: template.filter(t => t === cur).length
    }),
    {}
  )

  // object that has an entry for every rule and the count of times it appears in the string
  let ruleMap = rules.reduce(
    (acc, [pair]) => ({
      ...acc,
      [pair]: template.filter((t, i) => [t, template[i + 1]].join('') === pair)
        .length
    }),
    {}
  )

  // for each iteration, apply the rule. if it creates a new instance of a rule, increase the count.
  Array.from({ length: days }).forEach(() => {
    let dayCharCounts = {}
    let newRuleMap = pairs.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})

    rules.forEach(([pair, char]) => {
      const pairOccurances = ruleMap[pair]

      dayCharCounts = {
        ...dayCharCounts,
        [char]: dayCharCounts[char]
          ? dayCharCounts[char] + pairOccurances
          : pairOccurances
      }

      const [a, b] = pair.split('')

      const updateRuleMap = c => {
        newRuleMap[c] += pairs.includes(c) ? pairOccurances : 0
      }

      updateRuleMap(a + char)
      updateRuleMap(char + b)
    })

    charCounts = Object.entries(dayCharCounts).reduce(
      (acc, [char, count]) => ({ ...acc, [char]: (acc[char] || 0) + count }),
      charCounts
    )

    ruleMap = newRuleMap
  })

  return (
    Math.max(...Object.values(charCounts)) -
    Math.min(...Object.values(charCounts))
  )
}

const process = (part, expectedSampleAnswer, days) => {
  const sampleAnswer = polymerize('./day_14/sample_input.txt', days)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(
    `part ${part} real answer`,
    polymerize('./day_14/input.txt', days)
  )
}

process('A', 1588, 10)
process('B', 2188189693529, 40)
