import * as fs from 'fs'

const crateMover9000 = crateStacks => i => {
  Array.from({ length: i.count }).forEach(_ =>
    crateStacks[i.to - 1].push(crateStacks[i.from - 1].pop())
  )
}

const crateMover9001 = crateStacks => i => {
  const fromStack = crateStacks[i.from - 1]
  crateStacks[i.to - 1].push(...fromStack.splice(fromStack.length - i.count))
}

const stackSupplies = (fileName, crateMoverFn) => {
  const [crates, instructions] = fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)
  const rows = crates.split(/\r?\n/).filter(d => d)
  const length = Math.ceil(rows[0].length / 4)
  const crateStacks = Array.from({ length }, () => [])

  rows.forEach(r => {
    const rowArr = r.split('')

    for (let i = 0; i < rowArr.length; i += 4) {
      if (rowArr.slice(i, i + 4).includes('[')) {
        crateStacks[Math.floor(i / 4)].unshift(rowArr[i + 1])
      }
    }
  })

  instructions
    .split(/\r?\n/)
    .filter(d => d)
    .map(i => {
      const arr = i.split(' ')
      return { count: parseInt(arr[1]), from: parseInt(arr[3]), to: parseInt(arr[5]) }
    })
    .forEach(crateMoverFn(crateStacks))

  return crateStacks.map(s => s[s.length - 1]).join('')
}

const process = (part, expectedAnswer, crateMoverFn) => {
  const sampleAnswer = stackSupplies('./day_05/sample_input.txt', crateMoverFn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, stackSupplies('./day_05/input.txt', crateMoverFn))
}

process('A', 'CMZ', crateMover9000)
process('B', 'MCD', crateMover9001)
