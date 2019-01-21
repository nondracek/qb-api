const sendJSONRes = (res, status, content) => {
  res.status(status);
  res.json(content);
};

// execute function f on args
// if there is error, send response with status code and content and exit
// otherwise, return result
const catcher = async (res, status, content, f, ...args) => {
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
