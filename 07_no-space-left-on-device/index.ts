import { sum } from '../utilts.ts'

// @FIX
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

const input = Deno.readTextFileSync('./07_no-space-left-on-device/input.txt').trim().split('\n')

/// Construct filesystem
const fileSystem: Directory = {}
let currentLocation: Directory

input.forEach(line => {
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

      // Move
      // It seems the location is always found through ls before cding it
      // So we can assume the location already exists
      currentLocation = currentLocation[argument!]
      return
    
    case Command.List:
      return
    
    case Command.Dir:
      currentLocation[argument!] = {
        name: argument,
        '..': currentLocation,
        files: {},
      }
      return
    
    case Command.FileSize:
      currentLocation['files'][argument!] = fileSize
  }
})

/// Calculate directory sizes

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
    directory.totalSize = leafSize
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

  const sizes = Object.entries(directory)
    .filter(([childKey]) => childKey !== '..' && childKey !== 'files' && childKey !== 'name' && childKey !== 'totalSize')
    .map(([, d]) => sizesFlatFS(d))
    .flat()
  return sizes.concat([directory.totalSize])
}

calculateDirectorySize(fileSystem)
const allSizesFlattened = sizesFlatFS(fileSystem['/'])

const TOTAL_DISK_SPACE = 70000000
const UNUSED_SPACE_NEEDED = 30000000
const unusedSpace = TOTAL_DISK_SPACE - fileSystem['/'].totalSize
const remainingSpaceToDelete = UNUSED_SPACE_NEEDED - unusedSpace

export const part1 = allSizesFlattened.filter(size => size < 100000).reduce(sum)
export const part2 = allSizesFlattened.filter(size => size >= remainingSpaceToDelete).sort((a, b) => a - b)[0]
