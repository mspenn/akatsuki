/**
 * Created by v_chenqianming on 2015/11/5.
 */
var express = require('express');
var router = express.Router();
var resources = require("../core/common/resource_finder");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json(resources.list());
});

module.exports = router;