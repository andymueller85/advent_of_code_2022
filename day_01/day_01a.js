const input = require('fs')
  .readFileSync('./day_01/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => parseInt(d, 10))

const count = input.reduce((acc, cur, i, a) => {
  if (i === 0) return acc

  return cur > a[i - 1] ? acc + 1 : acc
}, 0)

console.log(count)
