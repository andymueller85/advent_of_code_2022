const input = require('fs')
  .readFileSync('./day_01/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => parseInt(d, 10))

// can omit cur + a[i + 1] because both sides of comparison have that.
const count = input.reduce(
  (acc, _, i, a) =>
    i === 0 || i > a.length - 3 || a[i + 2] <= a[i - 1] ? acc : acc + 1,
  0
)

console.log(count)
