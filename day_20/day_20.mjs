import * as fs from 'fs'

const parseInput = (fileName, encryptionKey) =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(v => parseInt(v) * encryptionKey)

const isBetween = (test, lower, upper) => lower <= test && test <= upper
const valAtN = (arr, n) => arr[(arr.findIndex(x => x.value === 0) + n) % arr.length].value

const getNewIndex = (value, itemToMove, lastIndex) => {
  const temp = itemToMove.curPos + value
  if (isBetween(temp, 1, lastIndex)) {
    return temp
  } else if (temp > lastIndex) {
    return temp % lastIndex
  }

  return lastIndex - (Math.abs(temp) % lastIndex)
}

const stepMappingFn = (value, itemToMove) => (s, _, arr) => {
  const newIndex = getNewIndex(value, itemToMove, arr.length - 1)

  if (s.curPos === itemToMove.curPos) {
    return { ...s, curPos: newIndex }
  } else if (newIndex > itemToMove.curPos && isBetween(s.curPos, itemToMove.curPos, newIndex)) {
    return { ...s, curPos: s.curPos - 1 }
  } else if (newIndex < itemToMove.curPos && isBetween(s.curPos, newIndex, itemToMove.curPos)) {
    return { ...s, curPos: s.curPos + 1 }
  }

  return s
}

const main = (filename, encryptionKey, iterations) => {
  const encrypted = parseInput(filename, encryptionKey)
  let holder = encrypted.map((v, i) => ({ value: v, curPos: i }))

  for (let i = 0; i < iterations; i++) {
    encrypted.forEach((v, originalIndex) => {
      const itemToMove = holder[originalIndex]
      if (itemToMove.value !== 0) {
        holder = holder.map(stepMappingFn(v, itemToMove))
      }
    })
  }

  const sorted = holder.sort((a, b) => a.curPos - b.curPos)
  return valAtN(sorted, 1000) + valAtN(sorted, 2000) + valAtN(sorted, 3000)
}

const process = (part, expectedAnswer, encryptionKey, iterations) => {
  const sampleAnswer = main('./day_20/sample_input.txt', encryptionKey, iterations)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, main('./day_20/input.txt', encryptionKey, iterations))
}

process('A', 3, 1, 1)
process('B', 1623178306, 811589153, 10)
