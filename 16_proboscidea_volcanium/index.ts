import { parseNumber } from '../parsing.ts'
import { lines } from 'utils'
import { monpar } from 'deps'
import produce from "https://cdn.skypack.dev/immer@8.0.1?dts"
const { take, liftAs, many, sentence, alt, unpack } = monpar

type NodeId = string

interface Node {
  source: NodeId
  flowRate: number
  leadingTo: NodeId[]
}

type Graph = Record<string, Node>

const TIME_PART_1 = 30 // minutes
const TIME_PART_2 = 26 // minutes
const STARTING_LOCATION = "AA"

const takeTwo = liftAs(
  (char: string) => (char2: string) => char + char2,
  take,
  take,
)

export const parseLine = liftAs<Node>(
  () => (source: string) => () => (flowRate: number) => (leadingTo: string[]) => ({
    source,
    flowRate,
    leadingTo,
  }),
  sentence("Valve "),
  takeTwo,
  sentence(" has flow rate="),
  parseNumber,
  alt(
    // Parse the part that leads to multiple tunnels
    liftAs(
      () => (x: string[]) => (y: string) => x.concat(y),
      sentence("; tunnels lead to valves "),
      many(liftAs(
        (leadingTo: string) => () => leadingTo,
        takeTwo,
        sentence(", ")
      )),
      takeTwo,
    ),
    // Or parse the part that leads to one tunnel
    liftAs(
      () => (valve: string) => [valve],
      sentence("; tunnel leads to valve "),
      takeTwo,
    )
  )
  
)

export const solvePart1 = (input: string) => {
  const graph: Graph = {}

  for (const line of lines(input)) {
    const node = unpack(parseLine)(line)!
    graph[node.source] = node
  }

  const dCache = dijkstraMmeo(graph)
  const optimal = findOptimal(graph, STARTING_LOCATION, TIME_PART_1, dCache)

  return optimal
}

const findOptimal = (graph: Graph, startingLocation: NodeId, timeLeft: number, dijkstra: ReturnType<typeof dijkstraMmeo>): number => {
  // Calculate the gain for each node
  const result: { destination: NodeId, amountValveRelease: number, timeSpent: number }[] = []

  for (const destination of Object.values(graph)) {
    if (dijkstra(startingLocation)[destination.source] + 1 > timeLeft) continue
    if (destination.flowRate === 0) continue
    if (destination.source === startingLocation) continue

    // Time to unlock = time to reach location + time to open valve (1 min)
    const timeToUnlock = dijkstra(startingLocation)[destination.source] + 1
    // This is the amount of time the valve would release for
    const timeAfter = timeLeft - timeToUnlock

    const amountValveRelease = timeAfter * destination.flowRate
    result.push({
      destination: destination.source,
      amountValveRelease,
      timeSpent: timeToUnlock
    })
  }

  if (result.length === 0) {
    return 0
  }

  // Approximation
  result.sort((a, b) => b.amountValveRelease - a.amountValveRelease)
  const amounts = result.slice(0, 10).map(res => {
    const copyGraph = produce(graph, (draft: Graph) => {
      draft[res.destination].flowRate = 0
    })
    return res.amountValveRelease + findOptimal(copyGraph, res.destination, timeLeft - res.timeSpent, dijkstra)
  })
  
  return Math.max(...amounts)
}

const dijkstraMmeo = (graph: Graph) => (startingNodeId: NodeId): Record<NodeId, number> => {
  const dijkstraCache: Record<NodeId, ReturnType<typeof dijkstra>> = {}

  if (dijkstraCache[startingNodeId]) return dijkstraCache[startingNodeId]

  dijkstraCache[startingNodeId] = dijkstra(graph, startingNodeId)
  return dijkstraCache[startingNodeId]
}

// All edges are weight 1
type DijkstraTable = Record<NodeId, number>
const dijkstra = (graph: Graph, startingNodeId: NodeId): Record<NodeId, number> => {
  const lookup: Record<NodeId, {
    id: NodeId,
    cost: number,
    visited: boolean,
  }> = {}

  for (const node of Object.values(graph)) {
    lookup[node.source] = {
      id: node.source,
      cost: Number.MAX_VALUE,
      visited: false,
    }
  }

  lookup[startingNodeId].cost = 0

  // Queue, .shift = .poll, .push = .enqueue
  // const neighbours = [graph[startingLocation]]
  let neighbours = [graph[startingNodeId]]

  while (neighbours.length !== 0) {
    neighbours = neighbours.sort((nb1, nb2) => lookup[nb1.source].cost - lookup[nb2.source].cost)

    const currentNode = neighbours.shift()!
    lookup[currentNode.source].visited = true

    for (const neighbour of currentNode.leadingTo) {
      if (lookup[neighbour].visited) continue

      lookup[neighbour].cost = Math.min(lookup[neighbour].cost, lookup[currentNode.source].cost + 1)
      neighbours.push(graph[neighbour])
    }
  }

  return Object.fromEntries(Object.entries(lookup).map(([k, { cost }]) => [k, cost]))
}

/**
 * I was going to use this for my first approach, which was going to involve some cost function
 * to punish for traveling too far, but I couldnt quite figure out the details.
 * 
 * Calculates the difference when you move from 1 location to the other,
 * say da = { a: 5 }, and db = { a: 7 }, that means that by moving to db,
 * you're increasing the distance to a by 2, so this function returns
 * { a: 2 }
 * 
 * Assumes all entries are equal
 * @param da Starting location
 * @param db Destination location
 */
const _dijkstraDifference = (da: DijkstraTable, db: DijkstraTable) => {
  return Object.fromEntries(Object.entries(db).map(([destination, cost]) => [destination, cost - da[destination]]))
}

export const solvePart2 = (input: string) => {
  // First have the human see how far they can get in 26 minutes,
  // Then with that updated graph, have the elephant go through it
  const graph: Graph = {}

  for (const line of lines(input)) {
    const node = unpack(parseLine)(line)!
    graph[node.source] = node
  }

  const dCache = dijkstraMmeo(graph)
  // First human goes through
  const optimalHuman = findOptimalIncludeGraph(graph, STARTING_LOCATION, TIME_PART_2, dCache)
  // Then the elephant goes through, note that we use the graph as it's left behind by the human
  const optimalElephant = findOptimalIncludeGraph(optimalHuman[0], STARTING_LOCATION, TIME_PART_2, dCache)

  return optimalHuman[1] + optimalElephant[1]
}

// All edges are weight 1
// We're also returning the graph state here
const findOptimalIncludeGraph = (graph: Graph, startingLocation: NodeId, timeLeft: number, dijkstra: ReturnType<typeof dijkstraMmeo>): [Graph, number] => {
  // Calculate the gain for each node
  const choices: { destination: NodeId, amountValveRelease: number, timeSpent: number }[] = []

  for (const destination of Object.values(graph)) {
    if (dijkstra(startingLocation)[destination.source] + 1 >= timeLeft) continue
    if (destination.flowRate === 0) continue
    if (destination.source === startingLocation) continue

    // Time to unlock = time to reach location + time to open valve (1 min)
    const timeToUnlock = dijkstra(startingLocation)[destination.source] + 1
    // This is the amount of time the valve would release for
    const timeAfter = timeLeft - timeToUnlock

    const amountValveRelease = timeAfter * destination.flowRate
    choices.push({
      destination: destination.source,
      amountValveRelease,
      timeSpent: timeToUnlock
    })
  }

  if (choices.length === 0) {
    return [graph, 0]
  }

  // Approximation
  choices.sort((a, b) => b.amountValveRelease - a.amountValveRelease)
  const result = choices.slice(0, 15).map(choice => {
    const copyGraph = produce(graph, (draft: Graph) => {
      draft[choice.destination].flowRate = 0
    })
    const recResult = findOptimalIncludeGraph(copyGraph, choice.destination, timeLeft - choice.timeSpent, dijkstra)
    return [recResult[0], choice.amountValveRelease + recResult[1]] as [Graph, number]
  })

  let max: [Graph, number] = [{}, Number.MIN_VALUE];

  for (const res of result) {
    if (max[1] < res[1]) {
      max = res
    }
  }
  
  return max
}
