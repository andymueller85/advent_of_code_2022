const input = require('fs')
  .readFileSync('./day_02/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => {
    const commandTuple = d.split(' ')
    return {
      command: commandTuple[0],
      value: parseInt(commandTuple[1], 10)
    }
  })

let horPos = 0
let depth = 0

input.forEach(c => {
  switch (c.command) {
    case 'forward':
      horPos += c.value
      break
    case 'up':
      depth -= c.value
      break
    case 'down':
      depth += c.value
      break
  }
})

console.log({ horPos, depth })
console.log({ answer: horPos * depth })
