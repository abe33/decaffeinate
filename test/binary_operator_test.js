import check from './support/check';

describe('binary operators', () => {
  it('passes subtraction through', () => {
    check(`
      a - b
    `, `
      a - b;
    `);
  });

  it('passes bitwise `and` through', () => {
    check(`
      a & b
    `, `
      a & b;
    `);
  });

  it('passes compound subtraction and bitwise `and` through', () => {
    check(`
      a - b & c
      a & b - c
    `, `
      a - b & c;
      a & b - c;
    `);
  });

  it('passes compound subtraction and bitwise `or` through', () => {
    check(`
      a - b | c
      a | b - c
    `, `
      a - b | c;
      a | b - c;
    `);
  });

  it('passes left shift through', () => {
    check(`
      a << b
    `, `
      a << b;
    `);
  });

  it('passes signed right shift through', () => {
    check(`
      a >> b
    `, `
      a >> b;
    `);
  });

  it('passes unsigned right shift through', () => {
    check(`
      a >>> b
    `, `
      a >>> b;
    `);
  });

  it('passes chained logical `or` through', () => {
    check(`
      a || b || c
    `, `
      a || b || c;
    `);
  });

  it('handles left shift as a nested operator', () => {
    check(`
      value = object.id << 8 | object.type
    `, `
      var value = object.id << 8 | object.type;
    `);
  });
});
