const getPaths = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split('-'))

  const mapConnections = (connectionMap, point) => ({
    ...connectionMap,
    [point]: input
      .filter(i => i.includes(point))
      .map(([a, b]) => (a === point ? b : a))
  })

  const caveConnections = input.reduce(
    (acc, [pointA, pointB]) => ({
      ...acc,
      ...mapConnections(acc, pointA),
      ...mapConnections(acc, pointB)
    }),
    {}
  )

  const isVisitedSmallCave = (cave, path) =>
    smallCaves.includes(cave) && path.includes(cave)

  const smallCaves = Object.keys(caveConnections).filter(
    k => k !== 'end' && k === k.toLowerCase()
  )

  const traverseMap = () => {
    let paths = 0

    const recurse = (currentPosition = 'start', path = []) => {
      if (currentPosition === 'end') {
        paths++
      } else if (!isVisitedSmallCave(currentPosition, path)) {
        caveConnections[currentPosition]
          .filter(c => c !== 'start')
          .forEach(c => recurse(c, [...path, currentPosition]))
      }
    }

    recurse()
    return paths
  }

  return traverseMap()
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = getPaths('./day_12/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, getPaths('./day_12/input.txt'))
}

process('A', 226)
