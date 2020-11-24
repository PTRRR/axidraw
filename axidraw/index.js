const EBB = require('ebb-tools');

module.exports = async () => {
  const list = await EBB.serialPort.getList();
  const { path } = list.find((it) => it.vendorId === '04d8');
  const port = await EBB.serialPort.getPort({ path });
  return new EBB.Board(port);
};
