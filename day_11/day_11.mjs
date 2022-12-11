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
        this.divisibleByTest = lastElement(a)
      } else if (a.includes('true: ')) {
        this.trueMonkey = lastElement(a)
      } else if (a.includes('false: ')) {
        this.falseMonkey = lastElement(a)
      } else {
        console.log('not good.')
      }

      this.inspectCount = 0
    })
  }

  inspectItems() {
    for (let i = 0; i < this.items.length; i++) {
      const last = lastElement(this.operation)
      let operand = last === 'old' ? this.items[i].worryLevel : parseInt(last)

      if (this.operation.includes('+')) {
        this.items[i].worryLevel += operand
      } else if (this.operation.includes('*')) {
        this.items[i].worryLevel *= operand
      } else {
        console.log('ummm.')
      }

      this.items[i].worryLevel = Math.floor(this.items[i].worryLevel / 3)
      this.items[i].throwTo =
        this.items[i].worryLevel % this.divisibleByTest === 0 ? this.trueMonkey : this.falseMonkey

      this.inspectCount++
    }
  }

  catchItem(item) {
    this.items.push({ ...item, throwTo: undefined })
  }
}

const lastElement = str => {
  const words = str.split(' ')
  return words[words.length - 1]
}

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(m => {
      return new Monkey(m)
    })

const partA = fileName => {
  const monkeys = parseInput(fileName)

  Array.from({ length: 20 }).forEach(() => {
    for (let i = 0; i < monkeys.length; i++) {
      monkeys[i].inspectItems()
      while (monkeys[i].items.length > 0) {
        const itemToThrow = monkeys[i].items.shift()
        monkeys.find(m => m.name === itemToThrow.throwTo).catchItem(itemToThrow)
      }
    }
  })

  return monkeys
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .slice(0, 2)
    .reduce((acc, cur) => acc * cur.inspectCount, 1)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_11/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_11/input.txt'))
}

process('A', 10605, partA)
