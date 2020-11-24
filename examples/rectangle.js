const getAxidraw = require('../axidraw');

const drawRectangle = async () => {
  const axidraw = await getAxidraw();
  const rectSize = 4000;

  await axidraw.moveTo(rectSize, 0);
  await axidraw.moveTo(rectSize, rectSize);
  await axidraw.moveTo(0, rectSize);
  await axidraw.moveTo(0, 0);
  await axidraw.waitForEmptyQueue();
  await axidraw.disableStepperMotors();
};

drawRectangle();
