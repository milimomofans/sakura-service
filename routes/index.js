var express = require('express');
var router = express.Router();

require('./api/article')(router)

module.exports = router;
