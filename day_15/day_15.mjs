import * as fs from 'fs'

class Sensor {
  constructor(sensorString) {
    const [s, b] = sensorString.split(': ')

    const [sensorXString, sensorYString] = s.split(', ')
    this.position = {
      x: parseInt(sensorXString.replace('Sensor at x=', '')),
      y: parseInt(sensorYString.replace('y=', ''))
    }

    const [beaconXString, beaconYString] = b.split(', ')
    this.nearestBeacon = {
      x: parseInt(beaconXString.replace('closest beacon is at x=', '')),
      y: parseInt(beaconYString.replace('y=', ''))
    }
  }

  noBeaconCoordinates() {
    const xDist = Math.abs(this.position.x - this.nearestBeacon.x)
    const yDist = Math.abs(this.position.y - this.nearestBeacon.y)

    const ranges = {}
    const gridDistance = xDist + yDist

    for (let i = this.position.y - gridDistance; i <= this.position.y + gridDistance; i++) {
      const xLimit = gridDistance - Math.abs(this.position.y - i)

      let lower = this.position.x - xLimit
      if (this.nearestBeacon.y === i && this.nearestBeacon.x === lower) lower++

      let upper = this.position.x + xLimit
      if (this.nearestBeacon.y === i && this.nearestBeacon.x === upper) upper--

      ranges[i] = { lower, upper }
    }

    return ranges
  }
}

const beaconsA = (fileName, row) => {
  const sensors = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(s => new Sensor(s))

  const mySet = new Set()

  sensors.forEach(s => {
    const myRowXVals = s.noBeaconCoordinates()[row]

    if (myRowXVals) {
      for (let i = myRowXVals.lower; i <= myRowXVals.upper; i++) {
        mySet.add(i)
      }
    }
  })

  return mySet.size
}

const beaconsB = (fileName, rowMax) => {
  const sensors = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(s => new Sensor(s))
  const knownBeacons = sensors.map(s => JSON.stringify([s.nearestBeacon.x, s.nearestBeacon.y]))
  const holder = Array.from({ length: rowMax + 1 }, () => [])

  sensors.forEach(s => {
    const noBeaconCoordinates = s.noBeaconCoordinates()
    Object.entries(noBeaconCoordinates).forEach(([key, value]) => {
      if (key >= 0 && key <= rowMax) {
        holder[key].push(value)
      }
    })
  })

  let answer
  holder.forEach((h, i) => {
    // this is essentially looking for "gaps" in the ranges - these are potential beacons
    const possible = h.find(j => h.map(k => k.lower).includes(j.upper + 2))

    if (possible) {
      const possibleX = possible.upper + 1
      const existsInARange = h.some(j => j.lower <= possibleX && possibleX <= j.upper)

      if (
        !existsInARange &&
        !knownBeacons.some(b => b === JSON.stringify([possible.upper + 1, i]))
      ) {
        // if it's not in one of the ranges and it's not one of the known beacons, we've found it!
        answer = (possible.upper + 1) * 4000000 + i
      }
    }
  })

  return answer
}

const processA = (expectedAnswer, testRow, realRow) => {
  const sampleAnswer = beaconsA('./day_15/sample_input.txt', testRow)

  console.log(`part A sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part A sample answer should be ${expectedAnswer}`)
  }

  console.log(`part A real answer`, beaconsA('./day_15/input.txt', realRow))
}

const processB = (expectedAnswer, testMax, realMax) => {
  const sampleAnswer = beaconsB('./day_15/sample_input.txt', testMax)

  console.log(`part B sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part B sample answer should be ${expectedAnswer}`)
  }

  console.log(`part B real answer`, beaconsB('./day_15/input.txt', realMax))
}

processA(26, 10, 2000000)
processB(56000011, 20, 4000000)

/*
part A sample answer 26
part A real answer 4737567
part B sample answer 56000011
part B real answer 13267474686239
*/
