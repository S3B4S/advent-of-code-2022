import fs from 'fs';
import { sum } from '../utilts';

// interface File {
//   [k: string]: File
//   size?: number
//   children: File[]
// }

// type Directory = Record<string, {
//   [k: string]: any // fix this
//   name: string
//   files: Record<string, number>
// }>

type Directory = Record<string, any>

enum Command { List, Cd, Dir, FileSize }

const parseLine = (line: string): [Command, string?, number?] => {
  const split = line.split(' ')
  if (line.startsWith('$')) {
    if (split[1] === 'ls') return [Command.List]
    if (split[1] === 'cd') return [Command.Cd, split[2]]
  }
  if (line.startsWith('dir')) return [Command.Dir, split[1]]
  return [Command.FileSize, split[1], Number(split[0])]
}

const input = fs.readFileSync(__dirname + '/../../day-07/input.txt', 'utf-8').trim().split('\n')

// const input = `
// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k
// `.trim().split('\n')

const example: Directory = {
  '/': {
    name: '/',
    '..': undefined,
    cgw: {
      name: 'cgw',
      '..': '/',
    },
    fbhz: {
      name: 'fbhz',
      '..': '/',
    },
    lvrzvt: {
      name: 'lvrzvt',
      '..': '/',
    },
    vwlps: {
      name: 'vwlps',
      '..': '/',
    },
    files: {
      vngq: 224312
    }
  }
}

// Construct filesystem
const fileSystem: Directory = {}
let currentLocation: Directory

input.forEach(line => {
  // console.log('---------')
  // console.log(currentLocation)
  // console.log(JSON.stringify(fileSystem, null, 2))
  const [command, argument, fileSize] = parseLine(line)
  switch (command) {
    case Command.Cd:
      // Special initlialise case
      if (argument === '/') {
        const rootObject: Directory = {
          name: '/',
          '..': undefined, // This should never be called I guess
          files: {},
        }
        fileSystem['/'] = rootObject
        currentLocation = rootObject
        return
      }

      // Move to parent
      if (argument === "..") {
        currentLocation = currentLocation['..']
        return
      }

      // Move location deeper
      // It seems the location is always found through ls before cding it
      // So we can assume the location already exists
      currentLocation = currentLocation[argument]
      return
    
    case Command.List:
      return
    
    case Command.Dir:
      currentLocation[argument] = {
        name: argument,
        '..': currentLocation,
        files: {},
      }
      return
    
    case Command.FileSize:
      currentLocation['files'][argument] = fileSize
  }
})

// console.log(fileSystem)

// Calculate directory sizes

/**
 * A direcotry is a leaf if it does not contain any other directories
 * In other words, only the keys 'name', '..' and 'files' are present
 * @param directory 
 */
const isLeaf = (directory: Directory) => {
  const keys = Object.keys(directory)
  return keys.length === 3 && keys.includes('..') && keys.includes('files') && keys.includes('name')
}

const calculateDirectorySize = (directory: Directory): number => {
  // base case
  if (isLeaf(directory)) {
    const leafSize = Object.values(directory.files).reduce(sum, 0) as number // FIX
    console.log('-------- Base case')
    console.log(directory)
    directory.totalSize = leafSize
    console.log(directory)
    return leafSize
  }

  // rec case
  const childrenSizes = Object.entries(directory)
    .filter(([childKey]) => childKey !== '..' && childKey !== 'files' && childKey !== 'name')
    .map(([, childDirectory]) => calculateDirectorySize(childDirectory))
  
  const dirSize = childrenSizes.reduce(sum, 0) + ((directory.files ? Object.values(directory.files).reduce(sum, 0) : 0) as number) // FIX
  directory.totalSize = dirSize
  return dirSize
}

const sizesFlatFS = (directory: Directory): number[] => {
  if (isLeaf(directory)) {
    return [directory.totalSize]
  }

  // console.log('----- Not base case ---')
  // console.log(directory)
  // console.log(directory.totalSize)
  const sizes = Object.entries(directory)
    .filter(([childKey]) => childKey !== '..' && childKey !== 'files' && childKey !== 'name' && childKey !== 'totalSize')
    .map(([, d]) => sizesFlatFS(d))
    .flat()
  return sizes.concat([directory.totalSize])
}

calculateDirectorySize(fileSystem)
// console.log(fileSystem)
const allSizesFlattened = sizesFlatFS(fileSystem['/'])
// console.log(allSizesFlattened)

export const part1 = allSizesFlattened.filter(size => size < 100000).reduce(sum)
export const part2 = ''