import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(i => i.split(' '))
    .map(([instr, val]) => [instr, parseInt(val)])

const execute = fileName => {
  const input = parseInput(fileName)

  let cycle = 1
  let x = 1
  let total = 0

  const checkValue = () => {
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      total += cycle * x
    }
  }

  const advanceCycle = () => {
    checkValue()
    cycle++
  }

  input.forEach(([instr, val]) => {
    if (instr === 'noop') {
      advanceCycle()
    } else if (instr === 'addx') {
      Array.from({ length: 2 }).forEach(() => {
        advanceCycle()
      })

      x += val
    }
  })

  return total
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = execute('./day_10/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, execute('./day_10/input.txt'))
}

process('A', 13140)
