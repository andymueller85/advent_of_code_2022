const findSafestPath = fileName => {
  const startingGrid = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '') // remove all \r characters to avoid issues on Windows
    .split('\n')
    .filter(d => d)
    .map(r => r.split('').map(c => parseInt(c, 10)))

  const tiles = Array.from({ length: 9 }).map((_, i) =>
    startingGrid.map(r => r.map(c => (c + i > 9 ? c + i - 9 : c + i)))
  )

  const grid = Array.from({ length: 5 }, (_, j) => j).reduce(
    (outerAcc, outerCur) => [
      ...outerAcc,
      ...Array.from({ length: 4 }, (_, i) => i + outerCur + 1).reduce(
        (acc, cur) => acc.map((r, i) => r.concat(...tiles[cur][i])),
        tiles[outerCur]
      )
    ],
    []
  )
  const GRID_WIDTH = grid.length
  const GRID_HEIGHT = grid[0].length

  const stringify = (rowIndex, colIndex) => `${rowIndex}-${colIndex}`
  const graph = {}

  const getNeighbors = ([r, c]) => {
    const candidates = [
      [r, c + 1],
      [r, c - 1],
      [r + 1, c],
      [r - 1, c]
    ]

    return candidates
      .filter(
        ([nR, nC]) => nR > -1 && nC > -1 && nR < GRID_WIDTH && nC < GRID_HEIGHT
      )
      .reduce(
        (acc, [fR, fC]) => ({
          ...acc,
          [stringify(fR, fC)]: grid[fR][fC]
        }),
        {}
      )
  }

  grid.forEach((r, rIdx) =>
    r.forEach((_, cIdx) => {
      graph[stringify(rIdx, cIdx)] = getNeighbors([rIdx, cIdx])
    })
  )

  const shortestDistanceNode = (distances, visited) => {
    const nonVisited = Object.entries(distances).filter(
      ([key]) => !visited.includes(key)
    )
    const minVal = Math.min(...nonVisited.map(([_, val]) => val))
    const shortest = nonVisited.find(([key]) => distances[key] === minVal)

    return shortest ? shortest[0] : undefined
  }

  const traverse = () => {
    const startKey = stringify(0, 0)
    const endKey = stringify(GRID_WIDTH - 1, GRID_HEIGHT - 1)

    const distances = {
      ...graph[startKey],
      [endKey]: Number.MAX_SAFE_INTEGER
    }

    const parents = { [endKey]: null }
    for (const child in graph[startKey]) {
      parents[child] = startKey
    }

    const visited = []

    let node = shortestDistanceNode(distances, visited)

    while (node) {
      const distance = distances[node]
      const children = graph[node]

      for (const child in children) {
        if (child.toString() === startKey) {
          continue
        } else {
          const newDistance = distance + children[child]
          if (!distances[child] || distances[child] > newDistance) {
            distances[child] = newDistance
            parents[child] = node
          }
        }
      }
      visited.push(node)

      node = shortestDistanceNode(distances, visited)
    }

    let parent = parents[endKey]
    while (parent) {
      parent = parents[parent]
    }

    return distances[endKey]
  }

  return traverse()
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = findSafestPath('./day_15/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, findSafestPath('./day_15/input.txt'))
}

process('B', 315)
