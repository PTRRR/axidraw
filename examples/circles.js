const getAxidraw = require('../axidraw');
const drawCircle = require('../utils/circle');

const draw = async () => {
  const axidraw = await getAxidraw();

  for (let i = 0; i < 10; i++) {
    const radius = i * 400 + 500;
    await drawCircle(axidraw, 0, 0, radius);
  }

  await axidraw.moveTo(0, 0);
  await axidraw.waitForEmptyQueue();
  await axidraw.disableStepperMotors();
};

draw();
