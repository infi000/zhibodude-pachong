/*
 * @Author: 张驰阳
 * @Date:   2017-01-09 17:59:10
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-11 17:56:06
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var charsetCompoent = require('superagent-charset'),
    //superagent不支持GBK编码 需要插件superagent-charset
    superagent = charsetCompoent(superagent);
var cheerio = require("cheerio");
var fs = require("fs");
var router = express.Router();
var get;
var start;
router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        get = 1;
        clearInterval(start);
        start = setInterval(function() {
            if (get == 1) {
                superagent.get("http://voice.hupu.com/generated/voice/news_nba.xml")
                    .buffer()
                    .charset('gb2312')
                    .type("xml")
                    .end(function(err, sres) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        fs.writeFile("./public/data/hupu.json", sres.text, function(err) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("写入hupu.json成功。" + new Date());
                            };
                        });

                    });
            }
        }, 120000);
        res.send("获取数据中。。。。。。关闭网页即可。。。。。")
    } else if (req.params.id == "2") {
        get = 2;
        clearInterval(start);
        console.log("结束写入hupu.json"+new Date());
        res.send("结束" + get)
    }
});

module.exports = router;
