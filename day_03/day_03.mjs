import * as fs from 'fs'

const parsedInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

const getNumericalValue = char => char.charCodeAt(0) - (char.toUpperCase() === char ? 38 : 96)

const sortRucksackA = fileName =>
  parsedInput(fileName).reduce((acc, r) => {
    const compartmentLength = r.length / 2
    const rucksackArr = r.split('')
    const compartment1 = rucksackArr.slice(0, compartmentLength)
    const compartment2 = rucksackArr.slice(compartmentLength)
    const sharedItem = compartment1.find(i => compartment2.includes(i))
    return acc + getNumericalValue(sharedItem)
  }, 0)

const sortRucksackB = fileName =>
  parsedInput(fileName).reduce((acc, _, i, arr) => {
    if (i % 3 !== 0) return acc

    const [r1, r2, r3] = arr.slice(i, i + 3).map(s => s.split(''))
    const sharedItem = r1.find(i => r2.includes(i) && r3.includes(i))
    return acc + getNumericalValue(sharedItem)
  }, 0)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_03/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_03/input.txt'))
}

process('A', 157, sortRucksackA)
process('B', 70, sortRucksackB)
