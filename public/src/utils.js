export function getEllipsePoint (cx, cy, rx, ry, angle, ellipseRotation = 0) {
  return {
    x:
      rx * Math.cos(angle) * Math.cos(ellipseRotation) -
      ry * Math.sin(angle) * Math.sin(ellipseRotation) +
      cx,
    y:
      rx * Math.cos(angle) * Math.sin(ellipseRotation) +
      ry * Math.sin(angle) * Math.cos(ellipseRotation) +
      cy,
  };
}

export function morphPoint (point1, point2, amplitude) {
  return {
    x: point1.x * (1 - amplitude) + point2.x * amplitude,
    y: point1.y * (1 - amplitude) + point2.y * amplitude,
  };
}
