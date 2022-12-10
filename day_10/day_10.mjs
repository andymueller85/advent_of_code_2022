import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(i => i.split(' '))
    .map(([instr, val]) => [instr, parseInt(val)])

const partA = fileName => {
  const input = parseInput(fileName)
  let cycle = 1
  let x = 1
  let total = 0

  const advanceCycle = () => {
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      total += cycle * x
    }
    cycle++
  }

  input.forEach(([instr, val]) => {
    Array.from({ length: instr === 'noop' ? 1 : 2 }).forEach(() => {
      advanceCycle()
    })

    if (instr === 'addx') x += val
  })

  return total
}

const partB = fileName => {
  const WIDTH = 40
  const HEIGHT = 6

  const input = parseInput(fileName)
  const screen = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => '.'))
  let sprite = 1
  let pixel = [0, 0]

  const advanceCycle = () => {
    if (pixel[1] < WIDTH - 1) {
      pixel[1]++
    } else {
      pixel[0]++
      pixel[1] = 0
    }
  }

  const renderPixel = () => {
    if ([sprite - 1, sprite, sprite + 1].includes(pixel[1])) {
      screen[pixel[0]][pixel[1]] = '#'
    }
  }

  input.forEach(([instr, val]) => {
    Array.from({ length: instr === 'noop' ? 1 : 2 }).forEach(() => {
      renderPixel()
      advanceCycle()
    })

    if (instr === 'addx') sprite += val
  })

  screen.forEach(l => console.log(l.join('')))
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_10/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_10/input.txt'))
}

process('A', 13140, partA)
console.log('\n\n********** PART B SAMPLE **********')
partB('./day_10/sample_input.txt')
console.log('\n\n********** PART B REAL ************')
partB('./day_10/input.txt')
