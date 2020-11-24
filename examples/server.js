const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const getAxidraw = require('../axidraw');

const PORT = 3000;

const init = async () => {
  const axidraw = await getAxidraw();

  const app = new Koa();
  const router = new Router();

  router.post('/', async (ctx, next) => {
    const path = ctx.request.body;

    if (path && Array.isArray(path)) {
      for (const [x, y] of path) {
        await axidraw.moveTo(x, y);
      }

      await axidraw.moveTo(0, 0);
      await axidraw.waitForEmptyQueue();
      await axidraw.disableStepperMotors();
    }

    ctx.response.status = 200;
    await next();
  });

  app.use(bodyparser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(PORT, () => {
    console.log(`Axidraw is litening on port ${PORT}`);
  });
};

init();
