/*
 * @Author: 张驰阳
 * @Date:   2017-01-09 17:59:10
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-09 18:39:31
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var fs = require("fs");
var iconvLite = require("iconv-lite");
var Buffer = require('buffer').Buffer;
var router = express.Router();

router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        superagent.get("http://voice.hupu.com/generated/voice/news_nba.xml")
            .end(function(err, sres) {
                if (err) {
                    console.log(err);
                    return;
                }
                var buf = new Buffer(sres.textg, 'binary');
                var bodyDecode = iconvLite.decode(buf, 'utf-8');
                res.send(bodyDecode);
            })

    };
});

module.exports = router;
