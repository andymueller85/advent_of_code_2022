import * as fs from 'fs'

class LanternFish {
  constructor(timer) {
    this.timer = parseInt(timer, 10)
  }

  get timer() {
    return this._timer
  }

  set timer(t) {
    this._timer = t
  }

  advanceDay() {
    if (this.timer === 0) this.timer = 6
    else this.timer--
  }
}

export const go = fileName => {
  const input = fs.readFileSync(fileName, 'utf8').replace('\n', '').split(',')

  const fishies = Array.from(
    { length: input.length },
    (_, i) => new LanternFish(input[i])
  )

  Array.from({ length: 80 }).forEach(() => {
    const newFishies = fishies
      .filter(f => f.timer === 0)
      .map(() => new LanternFish('8'))

    fishies.forEach(f => f.advanceDay())
    fishies.push(...newFishies)
  })

  return fishies.length
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = go('./day_06/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, go('./day_06/input.txt'))
}

process('A', 5934)
