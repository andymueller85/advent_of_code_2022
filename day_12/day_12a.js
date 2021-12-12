const getPaths = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(r => r.split('-'))

  const mapConnections = (connectionMap, point) => {
    const connectionsThatIncludePoint = input.filter(([a, b]) =>
      [a, b].includes(point)
    )

    return {
      ...connectionMap,
      [point]: connectionsThatIncludePoint.map(([a, b]) =>
        a === point ? b : a
      )
    }
  }

  // find all unique characters and map to all their connection points
  const caveConnections = input.reduce((acc, [pointA, pointB]) => {
    const keys = Object.keys(acc)
    let accHolder = { ...acc }
    if (!keys.includes(pointA)) {
      accHolder = mapConnections(accHolder, pointA)
    }
    if (!keys.includes(pointB)) {
      accHolder = mapConnections(accHolder, pointB)
    }

    return accHolder
  }, {})

  const smallCaves = Object.keys(caveConnections).filter(
    k => k !== 'end' && k === k.toLowerCase()
  )

  const traverseMap = () => {
    let paths = 0

    const recurse = (currentPosition = 'start', path = []) => {
      if (currentPosition === 'end') {
        console.log(path)
        paths++
      } else {
        if (
          !(
            smallCaves.includes(currentPosition) &&
            path.includes(currentPosition)
          )
        ) {
          caveConnections[currentPosition]
            .filter(c => c !== 'start')
            .forEach(c => {
              recurse(c, [...path, currentPosition])
            })
        }
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
