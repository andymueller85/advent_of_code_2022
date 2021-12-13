const input = require('fs')
  .readFileSync('./day_01/input.txt', 'utf8')
  .split(/\r?\n/)
  .filter(d => d)
  .map(d => parseInt(d, 10))

const count = input.reduce(
  (acc, cur, i, a) => (i === 0 || cur <= a[i - 1] ? acc : acc + 1),
  0
)

console.log(count)
