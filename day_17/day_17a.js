const getTrajectories = fileName => {
  const [xRange, yRange] = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .split(',')
    .map(r => r.split('..').map(c => parseInt(c, 10)))

  const target = {
    minX: xRange[0],
    maxX: xRange[1],
    minY: yRange[0],
    maxY: yRange[1]
  }

  const targetHit = p =>
    p.x >= target.minX &&
    p.y >= target.minY &&
    p.x <= target.maxX &&
    p.y <= target.maxY

  const shotStillGoing = (p, v) =>
    !targetHit(p) &&
    (v.y >= 0 || p.y >= target.minY) &&
    ((v.x >= 0 && p.x <= target.maxX) || (v.x <= 0 && p.x >= target.minX))

  const fireShot = v => {
    const p = { x: 0, y: 0 }

    let shotMaxYPosition = 0

    while (shotStillGoing(p, v)) {
      shotMaxYPosition = Math.max(shotMaxYPosition, p.y)

      if (!targetHit(p)) {
        p.x += v.x
        p.y += v.y
        if (v.x !== 0) {
          v.x += v.x > 0 ? -1 : 1
        }
        v.y--
      }
    }
    const hit = targetHit(p)
    return {
      finalX: p.x,
      finalY: p.y,
      hit,
      maxPosition: hit ? shotMaxYPosition : 0
    }
  }

  let overallMaxHeight = 0

  for (let y = 1000; y > 0; y--) {
    let minX = 0
    let maxX = 1000
    let result = fireShot({ x: maxX, y })

    while (minX < maxX && !result.hit) {
      // set the current min / max
      const middle = Math.floor((minX + maxX) / 2)
      result = fireShot({ x: middle, y })
      if (result.hit) {
        // might have to try some more y values here - could be multiple hits for the same y
        overallMaxHeight = Math.max(overallMaxHeight, result.maxPosition)
      } else {
        if (result.finalX < target.minX) {
          minX = middle + 1
        } else {
          maxX = middle - 1
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
