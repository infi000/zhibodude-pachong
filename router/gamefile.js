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

var get;
var start;
//get 获取目标网站json
router.get("/:id/:time", function(req, res) {
    //use superagent to clime website
    if (req.params.id == "1") {
        get = 1;
        clearInterval(start);
        var setTime=2000;
        if(req.params.time){
                setTime=req.params.time;
        }
        start = setInterval(function() {
            if (get == 1) {
                superagent.get(website).end(function(err, sres) {
                    if (err) {
                        return next(err);
                    }
                    //写入gamefile.json中
                    fs.writeFile("./public/data/gamefile.json", sres.text, function(err) {
                        if (err) {
                            console.error(err);
                        } else {
                                var today=new Date();
                            console.log(today+":写入成功gamefile.json！")
                        }
                    });
                });
            }
        }, setTime)
        res.send("获取数据中。。。。。。关闭网页即可。。。。。");
    } else if (req.params.id == "2") {
        get = 2;
        clearInterval(start);
         var today=new Date();
         console.log(today+":结束");
        res.send(today+":结束" + get)
    }
});

module.exports = router;