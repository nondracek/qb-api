const sendJSONRes = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const catcher = async (f, res, status, content, ...args) => {
  let error;
  const result = await f(...args).catch(err => {
    error = err;
  });
  if (!result || error) {
    sendJSONRes(res, status, content);
    return;
  }
  return result;
}

module.exports = { sendJSONRes, catcher };
