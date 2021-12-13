import * as fs from 'fs'

class LanternFish {
  constructor(timer = '8') {
    this.timer = parseInt(timer, 10)
  }
  get timer() {
    return this._timer
  }
  set timer(t) {
    this._timer = t
  }
  advanceDay() {
    this.timer += this.timer === 0 ? 6 : -1
  }
}

export const spawnFishies = (fileName, days) => {
  const input = fs
    .readFileSync(fileName, 'utf8')
    .replace(/\r?\n/, '')
    .split(',')
  const fishies = input.map(f => new LanternFish(f))

  Array.from({ length: days }).forEach(() => {
    const newFishies = fishies
      .filter(f => f.timer === 0)
      .map(() => new LanternFish())

    fishies.forEach(f => f.advanceDay())
    fishies.push(...newFishies)
  })

  return fishies.length
}

const process = (part, expectedAnswer, days) => {
  const sampleAnswer = spawnFishies('./day_06/sample_input.txt', days)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(
    `part ${part} real answer`,
    spawnFishies('./day_06/input.txt', days)
  )
}

process('A', 5934, 80)
