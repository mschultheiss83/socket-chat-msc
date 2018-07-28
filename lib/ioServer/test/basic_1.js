module.exports = function () {
  let n = 0;
  for (let i = 0; i < 1000000; i += 1) {
    n += n > 0 ? 1 : 1;
    if (n > 3000000) {
      throw new Error('testFunction Error: ' + i)
    }
  }
  return n;
};