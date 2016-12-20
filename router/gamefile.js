/*
 * @Author: 张驰阳
 * @Date:   2016-12-19 14:22:08
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2016-12-20 12:35:59
 */

'use strict';
var express = require("express");
var superagent = require("superagent");
var fs = require("fs");
var website = "http://espnzhibo.com/gamefile";
var router = express.Router();
//get 获取目标网站json
router.get("/:id", function(req, res) {
    //use superagent to clime website
    if (req.params.id == "1") {
        superagent.get(website).end(function(err, sres) {
            if (err) {
                return next(err);
            }
            //写入gamefile.json中
            fs.writeFile("./public/data/gamefile.json", sres.text, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("写入成功gamefile.json！")
                }
            });
            res.send(sres.text);
        });
    };
});

module.exports = router;
