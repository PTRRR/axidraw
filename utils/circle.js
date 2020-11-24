module.exports = async (axidraw, cX, cY, radius) => {
  const segments = 100;

  for (let i = 0; i < segments + 1; i++) {
    const angle = ((Math.PI * 2) / segments) * i;
    const x = Math.cos(angle) * radius + cX;
    const y = Math.sin(angle) * radius + cY;
    await axidraw.moveTo(x, y);
  }
};
