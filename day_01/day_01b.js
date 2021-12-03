const input = require('fs')
  .readFileSync('./day_01/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)
  .map(d => parseInt(d, 10))

  const count = input.reduce(
    // can omit cur + a[i + 1] because both sides of comparison have that.
    (acc, cur, i, a) => (i > a.length - 4 || a[i + 3] <= cur ? acc : acc + 1),
    0
  )

console.log(count)
