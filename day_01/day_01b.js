const input = require('fs')
  .readFileSync('./day_01/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => parseInt(d, 10))

const count = input.reduce((acc, cur, i, a) => {
  if (i === 0 || i > a.length - 3) return acc

  const sumCur = cur + a[i + 1] + a[i + 2]
  const sumPrev = a[i - 1] + cur + a[i + 1]

  return sumCur > sumPrev ? acc + 1 : acc
}, 0)

console.log(count)
