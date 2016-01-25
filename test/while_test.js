import check from './support/check';

describe('while', () => {
  it('surrounds its condition with parentheses', () => {
    check(`
      while a
        b
    `, `
      while (a) {
        b;
      }
    `);
  });

  it('adds braces indented correctly', () => {
    check(`
      if a
        while b
          c
    `, `
      if (a) {
        while (b) {
          c;
        }
      }
    `);
  });

  it('adds braces for single-line while loops correctly', () => {
    check(`
      b while a
    `, `
      while (a) {
        b;
      }
    `);
  });

  it('moves the body with the correct indentation', () => {
    check(`
      if a
        b while c
    `, `
      if (a) {
        while (c) {
          b;
        }
      }
    `);
  });

  it('does not add parentheses around the condition if they are already there', () => {
    check(`
      while (a)
        b
    `, `
      while (a) {
        b;
      }
    `);
  });

  it('turns an `until` loop into a `while` loop with a negated condition', () => {
    check(`
      until a
        b
    `, `
      while (!a) {
        b;
      }
    `);
  });

  it('wraps the `until` condition in parentheses if needed', () => {
    check(`
      until a < b
        a--
    `, `
      while (!(a < b)) {
        a--;
      }
    `);
  });

  it('turns `loop` into a `while` loop with an always-true condition', () => {
    check(`
      loop
        a
    `, `
      while (true) {
        a;
      }
    `);
  });

  it('handles `while` loops used as an expression', () => {
    check(`
      a(b while c)
    `, `
      a((() => {
        var result = [];
        while (c) {
          result.push(b);
        }
        return result;
      })());
    `);
  });

  it('does not consider a `while` loop as an implicit return if it returns itself', () => {
    check(`
      ->
        while true
          return a
    `, `
      (function() {
        while (true) {
          return a;
        }
      });
    `);
  });

  it('considers a `while` loop as an implicit return if it only returns within a function', () => {
    check(`
      ->
        while true
          -> return a
    `, `
      (function() {
        return (() => {
          var result = [];
          while (true) {
            result.push(function() { return a; });
          }
          return result;
        })();
      });
    `);
  });

  it('handles a `while` loop with a `then` body', () => {
    check(`
      while a then do (a) -> a
    `, `
      while (a) {
        (function(a) { return a; })(a);
      }
    `);
  });

  it('handles a `loop` with a `then` body', () => {
    check(`
      loop then a
    `, `
      while (true) {
        a;
      }
    `);
  });
});
