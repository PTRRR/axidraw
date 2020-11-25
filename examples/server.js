const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const serve = require('koa-static');
const mount = require('koa-mount');
const logger = require('koa-logger');
const getAxidraw = require('../axidraw');
const { getPaths } = require('../utils/font');

const PORT = 3000;

const init = async () => {
  const axidraw = await getAxidraw();

  const app = new Koa();
  const router = new Router();
  let busy = false;

  router.post('/', async (ctx, next) => {
    if (busy) return;
    busy = true;
    const path = ctx.request.body;

    if (path && Array.isArray(path)) {
      for (const point of path) {
        const [x, y, z] = point;
        if (z === 0) await axidraw.raiseBrush();
        if (z === 1) await axidraw.lowerBrush();
        await axidraw.moveTo(x, y);
      }

      await axidraw.raiseBrush();
      await axidraw.waitForEmptyQueue();
      await axidraw.disableStepperMotors();
    }

    busy = false;
    ctx.response.status = 200;
    await next();
  });

  router.get('/write', async (ctx, next) => {
    if (busy) return;
    busy = true;

    const { query } = ctx.request;
    const { word } = query;
    const scale = 5;

    const drawPoint = async ({ command, args }) => {
      switch (command) {
        case 'moveTo':
          await axidraw.raiseBrush();
          await axidraw.moveTo(args[0] * scale, args[1] * scale);
          break;
        case 'lineTo':
          await axidraw.lowerBrush();
          await axidraw.moveTo(args[0] * scale, args[1] * scale);
          break;
        case 'quadraticCurveTo':
          await axidraw.lowerBrush();
          await axidraw.moveTo(args[2] * scale, args[3] * scale);
          break;
      }
    };

    const paths = await getPaths(word);

    for (const path of paths) {
      let [firstPoint] = path;
      for (const point of path) {
        await drawPoint(point);
      }

      await drawPoint({ ...firstPoint, command: 'lineTo' });
    }

    await axidraw.raiseBrush();
    await axidraw.moveTo(0, 0);
    await axidraw.waitForEmptyQueue();
    await axidraw.disableStepperMotors();

    busy = false;
    ctx.response.status = 200;
    await next();
  });

  app.use(mount('/client', serve('./public/dist')));
  app.use(bodyparser());
  app.use(logger());
  app.use(router.allowedMethods());
  app.use(router.routes());

  app.listen(PORT, () => {
    console.log(`Axidraw is litening on port ${PORT}`);
  });
};

init();
