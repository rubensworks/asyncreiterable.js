import type { AsyncIterator } from 'asynciterator';
import { ArrayIterator, BufferedIterator } from 'asynciterator';
import type { AsyncReiterable } from './AsyncReiterable';

/**
 * An {@link AsyncReiterable} that is backed by an array.
 */
export class AsyncReiterableArray<T> implements AsyncReiterable<T> {
  private readonly array: (T | null)[];
  private readonly iterators: BufferedIterator<T>[];

  protected constructor(array: T[], terminate?: boolean) {
    this.array = [ ...array ];
    this.iterators = [];
    if (terminate) {
      this.array.push(null);
    }
  }

  /**
   * Create a new {@link AsyncReiterableArray} with the given data elements
   * that will be ended.
   * @param {T[]} array An array of data elements.
   * @return {AsyncReiterableArray<T>} A new ended {@link AsyncReiterableArray} with the given data elements.
   */
  public static fromFixedData<T>(array: T[]): AsyncReiterableArray<T> {
    return new AsyncReiterableArray(array, true);
  }

  /**
   * Create a new {@link AsyncReiterableArray} with the given data elements
   * that will not be ended.
   * @param {T[]} initialData An array of initial data elements.
   * @return {AsyncReiterableArray<T>} A new open-ended {@link AsyncReiterableArray} with the given data elements.
   */
  public static fromInitialData<T>(initialData: T[]): AsyncReiterableArray<T> {
    return new AsyncReiterableArray(initialData, false);
  }

  /**
   * @return {AsyncReiterableArray<T>} A new open-ended {@link AsyncReiterableArray} without data elements.
   */
  public static fromInitialEmpty<T>(): AsyncReiterableArray<T> {
    return AsyncReiterableArray.fromInitialData(<T[]> []);
  }

  protected static pushToIterator<T>(iterator: BufferedIterator<T>, data: T | null): void {
    if (data === null) {
      iterator.close();
    } else {
      // Beware: this is a hack
      (<any> iterator)._push(data);
    }
  }

  public iterator(): AsyncIterator<T> {
    if (this.isEnded()) {
      return new ArrayIterator(<T[]> <any> this.array.slice(0, -1), { autoStart: false });
    }
    const iterator: BufferedIterator<T> = new BufferedIterator<T>({ autoStart: false });
    for (const data of this.array) {
      AsyncReiterableArray.pushToIterator(iterator, data);
    }
    this.iterators.push(iterator);
    return iterator;
  }

  public push(data: T | null): void {
    if (this.isEnded()) {
      throw new Error('Can not push data anymore into an AsyncReiterableArray after it has been terminated.');
    }
    this.array.push(data);
    for (const iterator of this.iterators) {
      AsyncReiterableArray.pushToIterator(iterator, data);
    }
  }

  public isEnded(): boolean {
    return this.array.length > 0 && this.array.at(-1) === null;
  }
}
