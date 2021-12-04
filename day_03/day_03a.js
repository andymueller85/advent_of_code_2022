const input = require('fs')
  .readFileSync('./day_03/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)

const gammaRate = Array.from({ length: input[0].length }).reduce(
  (acc, _, i) =>
    `${acc}${
      input.map(n => n.charAt(i)).filter(d => d === '1').length >
      input.length / 2
        ? '1'
        : '0'
    }`,
  ''
)

const epsilonRate = gammaRate
  .split('')
  .reduce((acc, cur) => acc + (cur === '0' ? '1' : '0'), '')

const gammaAsDecimal = parseInt(gammaRate, 2)
const epsilonAsDecimal = parseInt(epsilonRate, 2)

console.log({ gammaRate, gammaAsDecimal, epsilonRate, epsilonAsDecimal })
console.log('answer', gammaAsDecimal * epsilonAsDecimal)
