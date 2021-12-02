const input = require('fs')
  .readFileSync('./day_02/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => d.split(' '))
  .map(([command, value]) => ({ command, value: parseInt(value, 10) }))

let horPos = 0
let depth = 0
let aim = 0

input.forEach(c => {
  switch (c.command) {
    case 'forward':
      horPos += c.value
      depth += aim * c.value
      break
    case 'up':
      aim -= c.value
      break
    case 'down':
      aim += c.value
      break
  }
})

console.log({ horPos, depth, aim })
console.log({ answer: horPos * depth })
