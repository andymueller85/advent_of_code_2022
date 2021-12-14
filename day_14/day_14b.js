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
  let rulesWithCounts = rules.reduce(
    (acc, [pair]) => ({
      ...acc,
      [pair]: template.filter((t, i) => [t, template[i + 1]].join('') === pair)
        .length
    }),
    {}
  )

  // for each iteration, apply the rule. if it creates a new instance of a rule, increase the count.
  Array.from({ length: days }).forEach(() => {
    let todayCharCounts = {}
    let newRulesWithCounts = pairs.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: 0
      }),
      {}
    )

    rules.forEach(([pair, charToInsert]) => {
      const pairOccurances = rulesWithCounts[pair]

      todayCharCounts = {
        ...todayCharCounts,
        [charToInsert]: todayCharCounts[charToInsert]
          ? todayCharCounts[charToInsert] + pairOccurances
          : pairOccurances
      }

      const [a, b] = pair.split('')

      if (pairOccurances > 0 && pairs.includes(a + charToInsert)) {
        newRulesWithCounts[a + charToInsert] += pairOccurances
      }
      if (pairOccurances > 0 && pairs.includes(charToInsert + b)) {
        newRulesWithCounts[charToInsert + b] += pairOccurances
      }
    })

    charCounts = Object.entries(todayCharCounts).reduce(
      (acc, [char, count]) =>
        // if key is already in map1, add the values, otherwise, create new pair
        ({ ...acc, [char]: (acc[char] || 0) + count }),
      { ...charCounts }
    )

    rulesWithCounts = newRulesWithCounts
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
