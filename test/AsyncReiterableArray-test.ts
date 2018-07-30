import {ArrayIterator, BufferedIterator} from "asynciterator";
import {AsyncReiterableArray} from "../lib/AsyncReiterableArray";
const arrayifyStream = require('arrayify-stream');

describe('AsyncReiterableArray', () => {

  describe('#forFixedData should return iterables that', () => {
    let iterable;

    beforeEach(() => {
      iterable = AsyncReiterableArray.forFixedData([1, 2, 3]);
    });

    it('should be instance of AsyncReiterableArray', () => {
      return expect(iterable).toBeInstanceOf(AsyncReiterableArray);
    });

    it('iterator() should to be instance of ArrayIterator', () => {
      return expect(iterable.iterator()).toBeInstanceOf(ArrayIterator);
    });

    it('iterator() contain all expected data elements', async () => {
      return expect(await arrayifyStream(iterable.iterator())).toEqual([1, 2, 3]);
    });

    it('should not allow push to be called', () => {
      return expect(() => iterable.push(10)).toThrow();
    });

    it('should be ended', () => {
      return expect(iterable.isEnded()).toBeTruthy();
    });
  });

  describe('#forInitialData should return iterables that', () => {
    let iterable;

    beforeEach(() => {
      iterable = AsyncReiterableArray.forInitialData([1, 2, 3]);
    });

    it('should be instance of AsyncReiterableArray', () => {
      return expect(iterable).toBeInstanceOf(AsyncReiterableArray);
    });

    it('iterator() should to be instance of BufferedIterator', () => {
      return expect(iterable.iterator()).toBeInstanceOf(BufferedIterator);
    });

    it('iterator() contain all initial data elements', () => {
      const it = iterable.iterator();
      expect(it.read()).toBe(1);
      expect(it.read()).toBe(2);
      expect(it.read()).toBe(3);
      expect(it.read()).toBe(null);
      expect(it.ended).toBe(false);
    });

    it('should allow push to be called', () => {
      return expect(() => iterable.push(10)).not.toThrow();
    });

    it('should not be ended', () => {
      return expect(iterable.isEnded()).toBeFalsy();
    });

    it('should become ended after null is pushed', () => {
      iterable.push(null);
      return expect(iterable.isEnded()).toBeTruthy();
    });

    it('should not allow null to be pushed two times', () => {
      iterable.push(null);
      return expect(() => iterable.push(null)).toThrow();
    });

    it('iterator() should end after the iterable becomes ended', async () => {
      const it = iterable.iterator();
      expect(it.read()).toBe(1);
      expect(it.read()).toBe(2);
      expect(it.read()).toBe(3);
      expect(it.read()).toBe(null);

      iterable.push(10);
      iterable.push(null);

      expect(it.read()).toBe(10);
      expect(it.read()).toBe(null);

      expect(iterable.isEnded()).toBe(true);
      return expect(await new Promise((resolve, reject) => {
        it.on('end', () => resolve(true));
      })).toBeTruthy();
    });

    it('iterator() contain all expected data elements for new iterators created after being ended', async () => {
      iterable.push(10);
      iterable.push(null);
      return expect(await arrayifyStream(iterable.iterator())).toEqual([1, 2, 3, 10]);
    });

    it('iterator() should return ArrayIterators for new iterators created after being ended', async () => {
      iterable.push(10);
      iterable.push(null);
      return expect(iterable.iterator()).toBeInstanceOf(ArrayIterator);
    });
  });

  describe('#forInitialEmpty should return iterables that', () => {
    let iterable;

    beforeEach(() => {
      iterable = AsyncReiterableArray.forInitialEmpty();
    });

    it('should be instance of AsyncReiterableArray', () => {
      return expect(iterable).toBeInstanceOf(AsyncReiterableArray);
    });

    it('iterator() should to be instance of BufferedIterator', () => {
      return expect(iterable.iterator()).toBeInstanceOf(BufferedIterator);
    });

    it('iterator() contain no data elements', () => {
      const it = iterable.iterator();
      expect(it.read()).toBe(null);
      expect(it.ended).toBe(false);
    });

    it('should allow push to be called', () => {
      return expect(() => iterable.push(10)).not.toThrow();
    });

    it('should not be ended', () => {
      return expect(iterable.isEnded()).toBeFalsy();
    });

    it('should become ended after null is pushed', () => {
      iterable.push(null);
      return expect(iterable.isEnded()).toBeTruthy();
    });

    it('should not allow null to be pushed two times', () => {
      iterable.push(null);
      return expect(() => iterable.push(null)).toThrow();
    });

    it('iterator() should end after the iterable becomes ended', async () => {
      const it = iterable.iterator();
      expect(it.read()).toBe(null);

      iterable.push(10);
      iterable.push(null);

      expect(it.read()).toBe(10);
      expect(it.read()).toBe(null);

      expect(iterable.isEnded()).toBe(true);
      return expect(await new Promise((resolve, reject) => {
        it.on('end', () => resolve(true));
      })).toBeTruthy();
    });

    it('iterator() contain all expected data elements for new iterators created after being ended', async () => {
      iterable.push(10);
      iterable.push(null);
      return expect(await arrayifyStream(iterable.iterator())).toEqual([10]);
    });

    it('iterator() should return ArrayIterators for new iterators created after being ended', async () => {
      iterable.push(10);
      iterable.push(null);
      return expect(iterable.iterator()).toBeInstanceOf(ArrayIterator);
    });
  });
});
