import { assertTypeExhaustion } from '../../src/helpers.ts';

describe('assertTypeExhaustion', () => {
  test('throws error when all types are not exhausted', () => {
    expect(() => assertTypeExhaustion('string')).toThrowError('Not all types have been exhausted properly');
  });

//   test('does not throw error when all types are exhausted', () => {
//     expect(() => assertTypeExhaustion()).not.toThrowError();
//   });
});