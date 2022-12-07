import * as fs from 'fs'

const LIMIT = 100000
let sizeTotal = 0

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
          // go up a directory
          curDirStack.pop()
        } else {
          //go down a directory
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
          // place this object at the current point in the tree
          updateObjProp(fileSystem, dirObject, curDirStack.join('.'))
        }
      }
    }
  })

  return fileSystem
}

const getDirSize = (obj, size) => {
  let innerSize = size

  Object.values(obj).forEach(e => {
    if (typeof e === 'string' || e instanceof String) {
      innerSize += parseInt(e)
    } else {
      innerSize += getDirSize(e, size)
    }
  })

  sizeTotal += innerSize <= LIMIT ? innerSize : 0

  return innerSize
}

const fileSizes = fileName => {
  sizeTotal = 0
  getDirSize(buildFileTree(fileName), 0)

  return sizeTotal
}

const process = (part, expectedAnswer) => {
  const sampleAnswer = fileSizes('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fileSizes('./day_07/input.txt'))
}

process('A', 95437)
