import simplify from 'simplify-path';
import { CurveInterpolator } from 'curve-interpolator';
import { getEllipsePoint, morphPoint } from './utils';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const print = document.querySelector('h1');

let paths = [];
let fullPath = [];
let scaledPath = null;
let currentPath = null;
let mouseDown = false;
const scale = 15;

const getMouse = (event) => {
  const { touches } = event;
  return touches ? touches[0] : event;
};

const handleMouseDown = (event) => {
  const { clientX, clientY } = getMouse(event);
  currentPath = [];
  mouseDown = true;
  currentPath.push([clientX, clientY]);
};

const handleMouseMove = (event) => {
  const { clientX, clientY } = getMouse(event);
  if (mouseDown) currentPath.push([clientX, clientY]);
};

const handleMouseUp = () => {
  mouseDown = false;
  paths.push(currentPath);
  currentPath = null;
  scaledPath = render(paths);
};

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('touchstart', handleMouseDown);
canvas.addEventListener('touchmove', handleMouseMove);
canvas.addEventListener('touchend', handleMouseUp);

print.addEventListener('click', () => {
  fetch(`${window.location.origin}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scaledPath),
  });
});

function render (paths) {
  fullPath = [];
  const { width, height } = canvas;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  for (const path of paths) {
    console.log(path);
    if (path.length > 0) {
      let started = false;

      const simplifiedPath = simplify(path, 10);

      const spline = new CurveInterpolator(simplifiedPath, 0.01);

      const pointsNum = Math.round(spline.length * 0.13);
      const points = spline.getPoints(pointsNum);

      ctx.beginPath();
      for (let i = 1; i < pointsNum; i++) {
        const [lastX, lastY] = points[i - 1];
        const [x, y] = points[i];
        const [nextX, nextY] = points[i + 1];

        const ellipseRotation = Math.atan2(y - lastY, x - lastX);
        const nextEllipseRotation = Math.atan2(nextY - y, nextX - x);

        const segments = 50;
        for (let j = 0; j < segments; j++) {
          const t = j / segments;
          const angle = t * Math.PI * 2 + i * 0.004;
          const rx = 25;
          const ry = width * 0.05;
          const lastPoint = getEllipsePoint(
            lastX,
            lastY,
            rx,
            ry,
            angle,
            ellipseRotation
          );
          const point = getEllipsePoint(
            x,
            y,
            rx,
            ry,
            angle,
            nextEllipseRotation
          );
          const { x: segmentX, y: segmentY } = morphPoint(lastPoint, point, t);
          ctx.lineTo(segmentX, segmentY);

          if (!started) {
            fullPath.push([segmentX, segmentY, 0]);
            started = true;
          }
          fullPath.push([segmentX, segmentY, 1]);
        }
      }

      ctx.stroke();
    }
  }

  return fullPath.map(([x, y, z]) => [x * scale, y * scale, z]);
}
