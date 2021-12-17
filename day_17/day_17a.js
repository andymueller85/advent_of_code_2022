const getTrajectories = fileName => {
  const [xRange, yRange] = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .split(',')
    .map(r => r.split('..').map(c => parseInt(c, 10)))

  const [minX, maxX] = xRange
  const [minY, maxY] = yRange
  const target = { minX, maxX, minY, maxY }

  const targetHit = p =>
    p.x >= target.minX &&
    p.y >= target.minY &&
    p.x <= target.maxX &&
    p.y <= target.maxY

  const shotStillGoing = (p, v) =>
    !targetHit(p) &&
    (v.y >= 0 || p.y >= target.minY) &&
    ((v.x >= 0 && p.x <= target.maxX) || (v.x <= 0 && p.x >= target.minX))

  const fireShot = velocity => {
    const position = { x: 0, y: 0 }

    let shotMaxYPosition = 0

    while (shotStillGoing(position, velocity)) {
      shotMaxYPosition = Math.max(shotMaxYPosition, position.y)

      if (!targetHit(position)) {
        position.x += velocity.x
        position.y += velocity.y
        if (velocity.x !== 0) {
          velocity.x += velocity.x > 0 ? -1 : 1
        }
        velocity.y--
      }
    }

    const hit = targetHit(position)

    return {
      finalX: position.x,
      finalY: position.y,
      hit,
      maxPosition: hit ? shotMaxYPosition : 0
    }
  }

  let overallMaxHeight = 0

  for (let y = 200; y > 0; y--) {
    let shotMinX = 0
    let shotMaxX = 200
    let result = fireShot({ x: shotMaxX, y })

    while (shotMinX < shotMaxX && !result.hit) {
      const middle = Math.floor((shotMinX + shotMaxX) / 2)
      result = fireShot({ x: middle, y })
      if (result.hit) {
        // might have to try some more y values here - could be multiple hits for the same y
        overallMaxHeight = Math.max(overallMaxHeight, result.maxPosition)
      } else {
        if (result.finalY < target.minY) {
          shotMinX = middle + 1
        } else {
          shotMaxX = middle - 1
        }
      }
    }
  }

  return overallMaxHeight
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = getTrajectories('./day_17/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, getTrajectories('./day_17/input.txt'))
}

process('A', 45)
