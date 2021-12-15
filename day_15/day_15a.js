const findSafestPath = fileName => {
  const grid = require('fs')
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(r => r.split('').map(c => parseInt(c, 10)))

  const GRID_WIDTH = grid.length
  const GRID_HEIGHT = grid[0].length

  const stringify = (rowIndex, colIndex) =>
    `${rowIndex.toString()}-${colIndex.toString()}`
  const graph = {}

  const getNeighbors = ([r, c]) => {
    const candidates = [
      [r, c + 1],
      [r + 1, c]
    ]

    const retArr = candidates.filter(
      ([nR, nC]) => nR > -1 && nC > -1 && nR < GRID_WIDTH && nC < GRID_HEIGHT
    )

    return retArr.reduce(
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
    // create a default value for shortest
    let shortest = null

    // for each node in the distances object
    for (let node in distances) {
      // if no node has been assigned to shortest yet
      // or if the current node's distance is smaller than the current shortest
      let currentIsShortest =
        shortest === null || distances[node] < distances[shortest]

      // and if the current node is in the unvisited set
      if (currentIsShortest && !visited.includes(node)) {
        // update shortest to be the current node
        shortest = node
      }
    }
    return shortest
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

    let shortestPath = [endKey]
    let parent = parents[endKey]

    while (parent) {
      shortestPath.push(parent)
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

process('A', 40)
