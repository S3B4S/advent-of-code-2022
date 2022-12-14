import { lines, range } from '../utilts.ts'

const lookup = [1000, 2000, 3000]

export const solvePart1 = (input: string) => {
  const initArrangement = lines(input).map(x => Number(x))
  
  // Construct cyclic linked list
  const ll = new CyclicLinkedList()

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
  // Construction of cyclic linked list done

  initArrangement.forEach((val, nodeId) => {
    ll.move(nodeId, val)
  })

  const node0 = ll.findNode(node => node.value === 0)
  
  let sum = 0
  lookup.forEach(n => {
    const moves = n % ll.amountNodes()
    let currentNode = node0
    for (let i = 0; i < moves; i++) {
      currentNode = currentNode!.next
    }
    sum += currentNode!.value
  })

  return sum
}

const DECRYPTION_KEY = 811589153
export const solvePart2 = (input: string) => {
  const initArrangement = lines(input).map(x => Number(x) * DECRYPTION_KEY)
  
  // Construct cyclic linked list
  const ll = new CyclicLinkedList()

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
  // Construction of cyclic linked list done

  for (const _ of range(0, 10)) {
    initArrangement.forEach((val, nodeId) => {
      ll.move(nodeId, val)
    })
  }

  const node0 = ll.findNode(node => node.value === 0)
  
  let sum = 0
  lookup.forEach(n => {
    const moves = n % ll.amountNodes()
    let currentNode = node0
    for (let i = 0; i < moves; i++) {
      currentNode = currentNode!.next
    }
    sum += currentNode!.value
  })

  return sum
}

export class Node {
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

export class CyclicLinkedList {
  elements: Node[]

  constructor() {
    this.elements = []
  }

  addNode(nodeId: number, node: Node) {
    this.elements[nodeId] = node
  }

  findNode(pred: (n: Node) => boolean) {
    return this.elements.find(pred)
  }

  amountNodes() {
    return this.elements.length
  }

  move(nodeId: number, amount: number) {
    // Subtract the cycles from the amount
    const movePositions = amount % (this.amountNodes() - 1)

    if (movePositions >= 0) {
      for (let i = 0; i < movePositions; i++) {
        this.moveUp(nodeId)
      }
      return
    }

    for (let i = 0; i > movePositions; i--) {
      this.moveDown(nodeId)
    }
  }

  toString() {
    let curretNode = this.elements[0]
    const res = [curretNode.value]
    for (const _ of range(0, this.amountNodes() - 1)) {
      curretNode = curretNode.next!
      res.push(curretNode.value)
    }
    return res.join(", ")
  }

  moveUp(nodeId: number) {
    // a X c d => a c X d
    const X = this.elements[nodeId] as Node
    const a = X.previous as Node
    const c = X.next as Node
    const d = c.next as Node
    
    a.next = c
    c.next = X
    X.next = d

    c.previous = a
    X.previous = c
    d.previous = X
  }

  moveDown(nodeId: number) {
    // a c X d => a X c d
    const X = this.elements[nodeId] as Node
    const c = X.previous as Node
    const a = c.previous as Node
    const d = X.next as Node

    a.next = X
    X.next = c
    c.next = d

    X.previous = a
    c.previous = X
    d.previous = c
  }
}
