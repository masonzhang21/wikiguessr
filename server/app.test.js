const getFirstSentence = require('./app.js');

test('adds 1 + 2 to equal 3', () => {
    expect(getFirstSentence("Hello there",)).toBe("Hello");
  });