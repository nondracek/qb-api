const express = require('express');
const cool = require('cool-ascii-faces');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(cool());
});

module.exports = router;
