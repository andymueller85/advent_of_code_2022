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

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .map(s => new Sensor(s))

const beaconsA = (fileName, row) => {
  const sensors = parseInput(fileName)
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
  const sensors = parseInput(fileName)
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

  return holder.reduce((acc, cur, y) => {
    if (acc) return acc

    // this is essentially looking for "gaps" in the ranges - these are potential beacons
    const possible = cur.find(a => cur.map(b => b.lower).includes(a.upper + 2))

    if (possible) {
      const possibleX = possible.upper + 1
      if (
        !cur.some(a => a.lower <= possibleX && possibleX <= a.upper) &&
        !knownBeacons.some(b => b === JSON.stringify([possibleX, y]))
      ) {
        // if it's not in one of the ranges and it's not one of the known beacons, we've found it!
        return possibleX * 4000000 + y
      }
    }
    return acc
  }, undefined)
}

const processA = (part, expectedAnswer, fn, testArg, realArg) => {
  const sampleAnswer = fn('./day_15/sample_input.txt', testArg)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_15/input.txt', realArg))
}

processA('A', 26, beaconsA, 10, 2000000)
processA('B', 56000011, beaconsB, 20, 4000000)

/*
part A sample answer 26
part A real answer 4737567
part B sample answer 56000011
part B real answer 13267474686239
*/
