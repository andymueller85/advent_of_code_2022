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
  const [head, ...rest] = propPath.split('.')

  if (rest.length === 0) {
    obj[head] = value
  } else {
    updateObjProp(obj[head], value, rest.join('.'))
  }
}

const buildFileTree = fileName => {
  const terminal = fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)

  let fileSystem = {}
  const curDirStack = []

  terminal.forEach((l, i) => {
    if (l.startsWith('$')) {
      const [_, cmd, arg] = l.split(' ')

      if (cmd === 'cd' && arg !== '/') {
        if (arg === '..') {
          curDirStack.pop()
        } else {
          curDirStack.push(arg)
        }
      } else if (cmd === 'ls') {
        const remainingLines = terminal.slice(i + 1)
        const end = remainingLines.findIndex(l2 => l2.startsWith('$'))
        const dirContents = remainingLines.slice(0, end === -1 ? undefined : end)

        const dirObject = dirContents.reduce((acc, dirItem) => {
          const [part1, part2] = dirItem.split(' ')
          return { ...acc, [part2]: part1 === 'dir' ? {} : part1 }
        }, {})

        if (curDirStack.length === 0) {
          fileSystem = dirObject
        } else {
          updateObjProp(fileSystem, dirObject, curDirStack.join('.'))
        }
      }
    }
  })

  return fileSystem
}

const getDirSize = (obj, size = 0) => {
  let innerSize = size

  Object.values(obj).forEach(e => {
    if (typeof e === 'string' || e instanceof String) {
      innerSize += parseInt(e)
    } else {
      innerSize += getDirSize(e, size)
    }
  })

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
