const getAxidraw = require('../axidraw');
const drawCircle = require('../utils/circle');

const draw = async () => {
  const axidraw = await getAxidraw();
  await drawCircle(axidraw, 0, 0, 4000);
  await axidraw.waitForEmptyQueue();
  await axidraw.disableStepperMotors();
};

draw();
