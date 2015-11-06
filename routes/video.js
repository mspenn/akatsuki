var express = require('express');
var router = express.Router();
var resources = require("../core/common/resource_finder");
var Transfer = require("../core/common/transfer");

/* GET users listing. */
router.get('/', function (req, res, next) {
    var res_code = req.query["res"];
    var t = new Transfer(req, res);
    t.trans(resources.find(res_code));
});

module.exports = router;