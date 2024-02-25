export class Queue<T> {
  public tasks: T[] = [];

  constructor(tasks: T[] = []) {
    this.tasks = tasks;
  }

  public dequeueOrder() {
    return this.tasks.shift();
  }

  public get tasksLeft() {
    return this.tasks.length;
  }
}
