import * as fs from 'fs'

class Monkey {
  constructor(monkeyString) {
    monkeyString
      .split(/\r?\n/)
      .filter(d => d)
      .forEach(l => {
        if (l.startsWith('Monkey')) {
          this.id = l.split(' ')[1].replace(':', '')
        } else if (l.includes('Starting items:')) {
          this.items = l
            .split(': ')[1]
            .split(', ')
            .map(i => ({ worryLevel: parseInt(i), throwTo: undefined }))
        } else if (l.includes('Operation')) {
          this.operation = l.split(': ')[1]
        } else if (l.includes('Test: ')) {
          this.divisibleByTest = parseInt(lastElement(l))
        } else if (l.includes('true: ')) {
          this.trueMonkey = lastElement(l)
        } else if (l.includes('false: ')) {
          this.falseMonkey = lastElement(l)
        }
      })
    this.inspectCount = 0
  }

  inspectItems(divideBy, modulo) {
    this.items.forEach(item => {
      const last = lastElement(this.operation)
      let modifier = last === 'old' ? item.worryLevel : parseInt(last)

      item.worryLevel = Math.floor(
        ((this.operation.includes('+') ? item.worryLevel + modifier : item.worryLevel * modifier) %
          modulo) /
          divideBy
      )
      item.throwTo =
        item.worryLevel % this.divisibleByTest === 0 ? this.trueMonkey : this.falseMonkey

      this.inspectCount++
    })
  }

  catchItem(item) {
    this.items.push({ ...item, throwTo: undefined })
  }
}

const lastElement = str => str.split(' ').reverse()[0]

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
        monkeys.find(m => m.id === itemToThrow.throwTo).catchItem(itemToThrow)
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
