/*
 * @Author: 张驰阳
 * @Date:   2016-12-20 12:24:12
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2016-12-20 14:13:19
 */

'use strict';
var express = require("express");
var fs = require("fs");
var router = express.Router();

//获取json接口
router.post("/:id", function(req, res, next) {
    fs.readFile("public/data/" + req.params.id + ".json", function(err, data) {
        if (err) {
            return console.error(err);
        };
        res.send(data.toString());
    });
    next();
}, function(err, req, res, next) {
    if (err) {
        res.send("没有获取数据")
    }
})

module.exports = router;
