import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(v => parseInt(v))

const isBetween = (test, lower, upper) => lower <= test && test <= upper
const nthIndex = (length, start, n) => (start + n) % length
const valAtN = (arr, n) => {
  const zeroIndex = arr.findIndex(x => x.value === 0)
  return arr[nthIndex(arr.length, zeroIndex, n)].value
}

const partA = filename => {
  const encrypted = parseInput(filename)
  let sorted = encrypted.map((v, i) => ({ value: v, originalPos: i, curPos: i }))

  encrypted.forEach((v, originalIndex) => {
    const itemToMove = sorted.find(s => s.originalPos === originalIndex)
    const lastIndex = encrypted.length - 1
    if (itemToMove.value !== 0) {
      let newIndex
      const temp = itemToMove.curPos + v
      if (isBetween(temp, 1, lastIndex)) {
        newIndex = temp
      } else if (temp > lastIndex) {
        newIndex = temp % lastIndex
      } else {
        newIndex = lastIndex - (Math.abs(temp) % lastIndex)
      }

      const newStep = sorted.map(s => {
        if (s.curPos === itemToMove.curPos) {
          return { ...s, curPos: newIndex }
        } else if (
          newIndex > itemToMove.curPos &&
          isBetween(s.curPos, itemToMove.curPos, newIndex)
        ) {
          return { ...s, curPos: s.curPos - 1 }
        } else if (
          newIndex < itemToMove.curPos &&
          isBetween(s.curPos, newIndex, itemToMove.curPos)
        ) {
          return { ...s, curPos: s.curPos + 1 }
        }

        return s
      })

      sorted = newStep.sort((a, b) => a.curPos - b.curPos)
    }
  })

  return valAtN(sorted, 1000) + valAtN(sorted, 2000) + valAtN(sorted, 3000)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_20/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_20/input.txt'))
}

process('A', 3, partA)
