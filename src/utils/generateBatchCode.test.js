import { generateBatchCode } from './generateBatchCode';

describe('generateBatchCode', () => {
  it('creates code using provided date', () => {
    const date = new Date('2024-05-01T00:00:00Z');
    const code = generateBatchCode('100D9CCC', '123', date);
    expect(code).toBe('100D9CCC-DC123-05-01-24');
  });
});

