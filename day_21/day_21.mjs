import * as fs from 'fs'

class Monkey {
  constructor(monkeyString) {
    const [name, data] = monkeyString.split(': ')
    const parsedData = data.split(' ')

    this.name = name

    if (parsedData.length === 1) {
      this.number = parseInt(parsedData[0])
    } else {
      ;[this.term1, this.operator, this.term2] = parsedData
    }
  }
}

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => new Monkey(d))

const main = filename => {
  const monkeys = parseInput(filename)
  const rootMonkey = monkeys.find(m => m.name === 'root')

  while (!rootMonkey.number) {
    monkeys
      .filter(m => !m.number)
      .forEach(m => {
        const m1 = monkeys.find(m1 => m1.name === m.term1 && m1.number)
        const m2 = monkeys.find(m2 => m2.name === m.term2 && m2.number)

        if (m1 && m2) {
          m.number = eval(`${m1.number} ${m.operator} ${m2.number}`)
        }
      })
  }

  return rootMonkey.number
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = main('./day_21/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, main('./day_21/input.txt'))
}

process('A', 152)
