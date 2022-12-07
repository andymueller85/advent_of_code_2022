import * as fs from 'fs'

const LIMIT = 100000
const UNUSED_SPACE_NEEDED = 30000000
const TOTAL_DISK_SPACE = 70000000
let sizeTotal = 0
let dirSizes = []

const initialize = () => {
  sizeTotal = 0
  dirSizes = []
}

const updateObjProp = (obj, value, propPath) => {
  const [head, ...rest] = propPath

  if (rest.length === 0) {
    obj[head] = value
  } else {
    updateObjProp(obj[head], value, rest)
  }
}

const buildFileTree = fileName => {
  let fileSystem = {}
  const dirStack = []

  fs.readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .forEach((l, i, terminal) => {
      if (!l.startsWith('$')) return

      const [_, cmd, arg] = l.split(' ')

      if (cmd === 'cd' && arg === '..') dirStack.pop()
      else if (cmd === 'cd' && arg !== '/') dirStack.push(arg)
      else if (cmd === 'ls') {
        const remainingLines = terminal.slice(i + 1)
        const end = remainingLines.findIndex(l2 => l2.startsWith('$'))

        const dirObject = remainingLines
          .slice(0, end === -1 ? undefined : end)
          .reduce((acc, dirItem) => {
            const [part1, part2] = dirItem.split(' ')
            return { ...acc, [part2]: part1 === 'dir' ? {} : part1 }
          }, {})

        if (dirStack.length === 0) {
          fileSystem = dirObject
        } else {
          updateObjProp(fileSystem, dirObject, dirStack)
        }
      }
    })

  return fileSystem
}

const getDirSize = (obj, size = 0) => {
  const innerSize = Object.values(obj).reduce(
    (acc, cur) => acc + (typeof cur === 'string' ? parseInt(cur) : getDirSize(cur, size)),
    size
  )

  sizeTotal += innerSize <= LIMIT ? innerSize : 0
  dirSizes.push(innerSize)

  return innerSize
}

const partA = fileName => {
  initialize()
  getDirSize(buildFileTree(fileName))

  return sizeTotal
}

const partB = fileName => {
  initialize()
  const currentUnusedSpace = TOTAL_DISK_SPACE - getDirSize(buildFileTree(fileName))
  const MIN_SIZE_NEEDED_TO_DELETE = UNUSED_SPACE_NEEDED - currentUnusedSpace

  return Math.min(...dirSizes.filter(s => s >= MIN_SIZE_NEEDED_TO_DELETE))
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_07/input.txt'))
}

process('A', 95437, partA)
process('B', 24933642, partB)
