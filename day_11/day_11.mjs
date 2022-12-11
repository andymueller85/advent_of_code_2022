import * as fs from 'fs'

class Monkey {
  constructor(monkeyString) {
    const attribues = monkeyString.split(/\r?\n/).filter(d => d)

    attribues.forEach(a => {
      if (a.startsWith('Monkey')) {
        this.name = a.split(' ')[1].replace(':', '')
      } else if (a.includes('Starting items:')) {
        this.items = a
          .split(': ')[1]
          .split(', ')
          .map(i => ({ worryLevel: parseInt(i), throwTo: undefined }))
      } else if (a.includes('Operation')) {
        this.operation = a.split(': ')[1]
      } else if (a.includes('Test: ')) {
        this.divisibleByTest = parseInt(lastElement(a))
      } else if (a.includes('true: ')) {
        this.trueMonkey = lastElement(a)
      } else if (a.includes('false: ')) {
        this.falseMonkey = lastElement(a)
      }

      this.inspectCount = 0
    })
  }

  inspectItems(divideBy, modulo) {
    this.items.forEach(item => {
      const last = lastElement(this.operation)
      let modifier = last === 'old' ? item.worryLevel : parseInt(last)

      item.worryLevel =
        (this.operation.includes('+') ? item.worryLevel + modifier : item.worryLevel * modifier) %
        modulo
      item.worryLevel = Math.floor(item.worryLevel / divideBy)
      item.throwTo =
        item.worryLevel % this.divisibleByTest === 0 ? this.trueMonkey : this.falseMonkey

      this.inspectCount++
    })
  }

  catchItem(item) {
    this.items.push({ ...item, throwTo: undefined })
  }
}

const lastElement = str => {
  const words = str.split(' ')
  return words[words.length - 1]
}

const monkeyBusiness = (fileName, divideBy, rounds) => {
  const monkeys = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(m => new Monkey(m))
  const modulo = monkeys.reduce((acc, cur) => acc * cur.divisibleByTest, 1)

  Array.from({ length: rounds }).forEach(() => {
    monkeys.forEach(m => {
      m.inspectItems(divideBy, modulo)
      while (m.items.length > 0) {
        const itemToThrow = m.items.shift()
        monkeys.find(m => m.name === itemToThrow.throwTo).catchItem(itemToThrow)
      }
    })
  })

  return monkeys
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .slice(0, 2)
    .reduce((acc, cur) => acc * cur.inspectCount, 1)
}

const process = (part, expectedAnswer, divideBy, rounds) => {
  const sampleAnswer = monkeyBusiness('./day_11/sample_input.txt', divideBy, rounds)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, monkeyBusiness('./day_11/input.txt', divideBy, rounds))
}

process('A', 10605, 3, 20)
process('B', 2713310158, 1, 10000)
