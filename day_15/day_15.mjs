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

const beacons = (fileName, row) => {
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

const process = (part, expectedAnswer, row) => {
  const sampleAnswer = beacons('./day_15/sample_input.txt', 10)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, beacons('./day_15/input.txt', 2000000))
}

process('A', 26, 10)
// process('B', 93, continueFnB, true)
