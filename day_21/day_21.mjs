import * as fs from 'fs'

const isPresent = a => a !== undefined

class Monkey {
  constructor(monkeyString, humanValue) {
    const [name, data] = monkeyString.split(': ')
    const parsedData = data.split(' ')

    this.name = name

    if (parsedData.length === 1) {
      this.number = name === 'humn' && isPresent(humanValue) ? humanValue : parseInt(parsedData[0])
    } else {
      ;[this.term1, this.operator, this.term2] = parsedData
    }
  }
}

const evaluateMonkey = monkeys => m => {
  const m1 = monkeys.find(x => x.name === m.term1 && isPresent(x.number))
  const m2 = monkeys.find(x => x.name === m.term2 && isPresent(x.number))

  if (m1 && m2) {
    m.number = eval(`${m1.number} ${m.operator} ${m2.number}`)
  }
}

const parseInput = (fileName, humanValue) =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => new Monkey(d, humanValue))

const partA = filename => {
  const monkeys = parseInput(filename)
  const rootMonkey = monkeys.find(m => m.name === 'root')

  while (!rootMonkey.number) {
    monkeys.filter(m => !isPresent(m.number)).forEach(evaluateMonkey(monkeys))
  }

  return rootMonkey.number
}

const partB = (filename, sample) => {
  let start = 0
  let end = Number.MAX_SAFE_INTEGER

  // this does a binary search of numbers 0 - MAX_SAFE_INTEGER until it finds one that works
  while (start < end) {
    let i = Math.floor((start + end) / 2)
    const monkeys = parseInput(filename, i)

    const rootMonkey = monkeys.find(m => m.name === 'root')
    const m1 = monkeys.find(m1 => m1.name === rootMonkey.term1)
    const m2 = monkeys.find(m2 => m2.name === rootMonkey.term2)

    while (!isPresent(m1.number) || !isPresent(m2.number)) {
      monkeys.filter(m => !isPresent(m.number)).forEach(evaluateMonkey(monkeys))
    }

    if (m1.number === m2.number) {
      return i // found it!
    }

    // This has to flip because in the sample m1 stays constant and m2 changes and it's flipped in the real dataset.
    // Could probably find a dynamic way to do this, but meh.
    if (sample ? m1.number < m2.number : m1.number > m2.number) start = i + 1
    else end = i - 1
  }

  return 'fail'
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_21/sample_input.txt', true)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_21/input.txt'))
}

process('A', 152, partA)
process('B', 301, partB)
