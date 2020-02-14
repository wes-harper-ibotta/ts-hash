import { SList, ListNode } from './sList';

type HashItem = [string, any];

class HashMap {
  // represents the number of key/value pairs in the map
  length: number;
  private map: Array<SList<HashItem>>;
  // stores a closure that represents the next length of the map
  private readonly _size: () => number;

  constructor() {
    this.map = [new SList()];
    this.length = 0;
    this._size = this._currentSize();
  }

  // helpful for deciding when to rebalance
  get loadFactor(): number {
    return this.length / this.map.length;
  }

  add(item: HashItem): void {
    const hash: number = HashMap._hash(item[0]);
    const index = hash % this.map.length;
    const matchingNode: ListNode<HashItem> | null = this.map[index].get(
      (node: ListNode<HashItem> | null): boolean =>
        !!node && node.val[0] === item[0]
    );
    if (matchingNode) {
      matchingNode.val[1] = item[1];
    } else {
      this.map[index].pushFront(item);
      this.length++;
    }
    if (this.loadFactor > 2.5) {
      this._rehash();
    }
  }

  // returns the value associated with the key
  find(key: string): any {
    const hash: number = HashMap._hash(key);
    const index = hash % this.map.length;
    const matchingNode: ListNode<HashItem> | null = this.map[index].get(
      (node: ListNode<HashItem> | null): boolean =>
        !!node && node.val[0] === key
    );
    return matchingNode?.val[1];
  }

  // removes and returns the value associated with the given key
  remove(key: string): any {
    const hash: number = HashMap._hash(key);
    const index = hash % this.map.length;
    const removedNode: ListNode<HashItem> | null = this.map[index].remove(
      (node: ListNode<HashItem> | null): boolean =>
        !!node && node.val[0] === key
    );
    if (removedNode) {
      this.length--;
    }
    return removedNode?.val[1];
  }

  private static _hash(key: string): number {
    let hash: number = 0;
    for (let i = 0; i < key.length; i++) {
      const charCode: number = key.charCodeAt(i);
      hash = (hash << 5) + charCode;
    }
    // convert to a positive 32 bit int
    // any bitwise operation in JS will convert a number to a 32 bit int
    return (hash &= 0x7fffffff);
  }

  private _rehash(): void {
    const oldMap: Array<SList<HashItem>> = this.map;
    this.map = this._createNewMap();
    this.length = 0;
    for (const bucket of oldMap) {
      while (bucket.head) {
        const item: ListNode<HashItem> = bucket.popFront()!;
        this.add(item.val);
      }
    }
  }

  private _createNewMap(): Array<SList<HashItem>> {
    const newSize: number = this._size();
    return Array.from(Array(newSize), () => new SList());
  }

  private _currentSize(): () => number {
    const sizes = [3, 7, 17, 31, 67, 127, 257, 521, 1087];
    let currentIndex = 0;
    function validSizes() {
      // increments after getting the value at the current index
      if (currentIndex > sizes.length) {
        throw new Error('Maximum hash capacity reached');
      }
      const size = sizes[currentIndex++];
      return size;
    }
    return validSizes;
  }
}

const hash = new HashMap();
hash.add(['key', 'value']);
hash.add(['other', 'value']);
hash.add(['other', 'thing']);
hash.add(['another', 'thing']);
hash.add(['thing', 'thing']);
hash.add(['wee', 'thing']);
hash.add(['foo', 'thing']);
console.log(hash.find('wee'));
console.log(hash.find('asdfasdf'));
console.log(hash.length);
console.log(hash.remove('asdfasdf'));
console.log(hash.length);
console.log(hash.remove('wee'));
console.log(hash.length);
