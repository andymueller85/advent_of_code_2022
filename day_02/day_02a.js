const input = require('fs')
  .readFileSync('./day_02/input.txt', 'utf8')
  .split(/\r?\n/)
  .filter(d => d)
  .map(d => d.split(' '))
  .map(([command, value]) => ({ command, value: parseInt(value, 10) }))

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
