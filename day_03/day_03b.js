const input = require('fs')
  .readFileSync('./day_03/input.txt', 'utf8')
  .split('\n')
  .filter(d => d)

const calculateRating = (arr, useMajority, pos = 0) => {
  const majority =
    arr.filter(d => d.charAt(pos) === '1').length >= arr.length / 2 ? '1' : '0'
  const minority = majority === '0' ? '1' : '0'

  const filteredArray = arr.filter(
    d => d.charAt(pos) === (useMajority ? majority : minority)
  )

  if (filteredArray.length <= 1) return filteredArray

  return calculateRating(filteredArray, useMajority, pos + 1)
}

const ogr = calculateRating(input, true)
const ogrAsDecimal = parseInt(ogr, 2)
const cgr = calculateRating(input, false)
const cgrAsDecimal = parseInt(cgr, 2)

console.log({ ogr, ogrAsDecimal, cgr, cgrAsDecimal })
console.log({ answer: ogrAsDecimal * cgrAsDecimal })
