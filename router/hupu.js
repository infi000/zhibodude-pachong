/*
 * @Author: 张驰阳
 * @Date:   2017-01-09 17:59:10
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-10 11:59:51
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

router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        superagent.get("http://voice.hupu.com/generated/voice/news_nba.xml")
            .buffer()
            .charset('gb2312')
            .type("xml")
            .end(function(err, sres) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send(sres.text)
            })

    };
});

module.exports = router;
