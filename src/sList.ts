export class ListNode<T> {
  val: T;
  next: ListNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}

// I envision this class working essentially as a stack, easy to push and pop for new additions and for rehashing, with its own lookupp class that can be easily used
export class SList<T> {
  head: ListNode<T> | null;

  constructor() {
    this.head = null;
  }

  pushFront(val: T): void {
    const node: ListNode<T> = new ListNode<T>(val);
    node.next = this.head;
    this.head = node;
  }

  popFront(): ListNode<T> | null {
    const node: ListNode<T> | null = this.head;
    if (node) {
      this.head = node.next;
    }
    return node;
  }

  remove(predicate: (node: ListNode<T> | null) => boolean): ListNode<T> | null {
    if (!this.head) {
      return null;
    }
    if (predicate(this.head)) {
      return this.popFront();
    }
    let currentNode: ListNode<T> | null = this.head;
    while (currentNode!.next) {
      if (predicate(currentNode!.next)) {
        const removedNode: ListNode<T> = currentNode!.next;
        currentNode!.next = removedNode.next;
        removedNode.next = null;
        return removedNode;
      }
      currentNode = currentNode!.next;
    }
    return null;
  }

  get(predicate: (node: ListNode<T> | null) => boolean): ListNode<T> | null {
    let currentNode: ListNode<T> | null = this.head;
    while (currentNode) {
      if (predicate(currentNode)) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }
}
