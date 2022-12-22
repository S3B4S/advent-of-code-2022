import { lines } from '../utilts.ts'

export const solvePart1 = (input: string) => {
  const initArrangement = lines(input).map(x => Number(x))
  
  const ll = new LinkedList()

  const startNode = new Node(initArrangement[0])
  ll.addNode(0, startNode)

  let prevNode = startNode
  for (let i = 1; i < initArrangement.length - 1; i++) {
    const node = new Node(initArrangement[i], prevNode)
    prevNode.next = node
    ll.addNode(i, node)
    prevNode = node
  }

  const lastNode = new Node(initArrangement.at(-1)!)
  prevNode.next = lastNode
  lastNode.previous = prevNode
  lastNode.next = startNode
  ll.addNode(initArrangement.length - 1, lastNode)
  startNode.previous = lastNode

  // If move positive by N
  // next moves up with N
  // prev moves up with N - 1

  // Old next of moved el:
  // Prev should point to old prev of el
  // old prev would remain unchanges
  console.log(ll)
  ll.moveUp(0, 1)
  console.log(ll)

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}

class Node {
  value: number
  next?: Node
  previous?: Node

  constructor(value: number, previous?: Node, next?: Node) {
    this.value = value
    this.previous = previous
    this.next = next
  }

  setNext(node: Node) {
    this.next = node
  }

  setPrev(node: Node) {
    this.previous = node
  }
}

class LinkedList {
  elements: Record<number, Node>

  constructor() {
    this.elements = {}
  }

  addNode(nodeIndex: number, node: Node) {
    this.elements[nodeIndex] = node
  }

  moveUp(nodeIndex: number, amount: number) {
    const node = this.elements[nodeIndex]
    const prevNode = node.previous
    const nextNode = node.next

    if (!(node && node.next && prevNode && nextNode)) return

    prevNode.next = node.next
    node.previous = node.next
    nextNode.previous = prevNode 
    nextNode.next = node
    node.next = node.next.next
  }
}
