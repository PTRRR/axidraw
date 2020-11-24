const fontKit = require('fontkit');
const FONT_NAME = 'Basic-Commercial-LT-Com-Bold.ttf';

const getPaths = (word) => {
  const font = fontKit.openSync(`./assets/${FONT_NAME}`);
  const glyphs = font.glyphsForString(word);
  return glyphs.map(({ path }) => path.commands);
};

module.exports = { getPaths };
