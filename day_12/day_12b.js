const getPaths = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
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

  const visitCave = (visited, cave) =>
    smallCaves.includes(cave)
      ? { ...visited, [cave]: visited[cave] + 1 }
      : visited

  const smallCaves = Object.keys(caveConnections).filter(
    k => k !== 'end' && k === k.toLowerCase()
  )

  const initialVisited = smallCaves.reduce(
    (acc, cur) => ({ ...acc, [cur]: 0 }),
    {}
  )

  const shouldRecurse = (currentPosition, visited) =>
    !smallCaves.includes(currentPosition) ||
    visited[currentPosition] === 0 ||
    Object.keys(visited).every(k => visited[k] < 2)

  const traverseMap = () => {
    let paths = 0

    const recurse = (currentPosition = 'start', visited = initialVisited) => {
      if (currentPosition === 'end') {
        paths++
      } else if (shouldRecurse(currentPosition, visited)) {
        caveConnections[currentPosition]
          .filter(c => c !== 'start')
          .forEach(c => recurse(c, visitCave(visited, currentPosition)))
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

process('B', 3509)
