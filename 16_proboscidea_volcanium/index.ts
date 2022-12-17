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

const TIME = 30 // minutes

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
  let startingLocation: string | undefined = "AA"

  for (const line of lines(input)) {
    const node = unpack(parseLine)(line)!
    if (!startingLocation) startingLocation = node.source

    graph[node.source] = node
  }

  if (!startingLocation)
    return new Error("No starting location found")

  const dCache = dijkstraMmeo(graph)
  const optimal = findOptimal(graph, startingLocation, TIME, dCache)

  console.log(optimal)
  return 0
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

  // This is kind of a hacky guess, but I'm sorting the best amounts
  // and then grabbing the top 10 for recrusion. My hope was that the optimal
  // answer would always be in the top 10 distances at each step so I could cut down
  // on computing time
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

  const d = dijkstra(graph, startingNodeId)
  dijkstraCache[startingNodeId] = d
  return d
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
 * Calculates the difference when you move from 1 location to the other,
 * say da = { a: 5 }, and db = { a: 7 }, that means that by moving to db,
 * you're increasing the distance to a by 2, so this function returns
 * { a: 2 }
 * 
 * Assumes all entries are equal
 * @param da Starting location
 * @param db Destination location
 */
const dijkstraDifference = (da: DijkstraTable, db: DijkstraTable) => {
  return Object.fromEntries(Object.entries(db).map(([destination, cost]) => [destination, cost - da[destination]]))
}

export const solvePart2 = (input: string) => {
  return 0
}

// solvePart1(`
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II
// `)
