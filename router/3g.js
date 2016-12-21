/*
 * @Author: 张驰阳
 * @Date:   2016-12-21 10:12:11
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2016-12-21 12:27:12
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var fs = require("fs");

var date = function() {
    var oDate = new Date();
    oDate.setDate(oDate.getDate()+1);//国外加一天
    var year = oDate.getFullYear(); //获取系统的年；
    var month = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    var day = oDate.getDate(); // 获取系统日，
    return year + "-" + month + "-" + day
};
var website = "http://newdata.3g.cn/jsonInterface/index.php/Nba/Data/schedulelive?dataType=1&date=" + date();
var router = express.Router();

router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        superagent.get(website).end(function(err, sres) {
            if (err) {
                return next(err);
            };
            // var item = [];
            var item = JSON.parse(sres.text).map(function( index,key) {
                var time2 = index.HCN;
                var time1 = index.VCN;
                // NBA常规赛: 鹈鹕 vs 76人
                var title = "NBA常规赛: " + time1 + " vs " + time2;
                // http://nlive.3g.cn/1/?lid=58186
                var url = "http://nlive.3g.cn/1/?lid=" + index.LID;
                return {
                    title: title,
                    url: url
                }
            });
            fs.writeFile("./public/data/3g.json", JSON.stringify(item), function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("写入3g.json成功。")
                };
            });
            res.send(item);
        });
    };
});

module.exports = router;
