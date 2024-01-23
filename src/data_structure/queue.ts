export class Queue<T> {
    private entries: T[] = [];

    enqueue(task: T) {
        this.entries.push(task);
    }

    dequeue(): T | undefined {
        return this.entries.shift();
    }

    isEmpty(): boolean {
        return this.entries.length === 0;
    }
}