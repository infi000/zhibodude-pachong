/*
 * @Author: 张驰阳
 * @Date:   2016-12-21 10:12:11
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-03 09:43:41
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var fs = require("fs");

var date = function(num) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + num); //国外加一天
    var year = oDate.getFullYear(); //获取系统的年；
    var month = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    var day = oDate.getDate(); // 获取系统日，
    if(month<10){
        month="0"+month;
    };
    if(day<10){
        day="0"+day;
    }
    return year + "-" + month + "-" + day
};
// var website = "http://newdata.3g.cn/jsonInterface/index.php/Nba/Data/schedulelive?dataType=1&date=" + date(num);
var router = express.Router();

router.get("/:id/:num", function(req, res) {
    if (req.params.id == "1") {
        var _num=req.params.num;
        _num=parseInt(_num);
        console.log(_num);
        console.log(date(_num));
        var website = "http://newdata.3g.cn/jsonInterface/index.php/Nba/Data/schedulelive?dataType=1&date=" + date(_num);
        console.log(website);
        superagent.get(website).end(function(err, sres) {
            if (err) {
                return next(err);
            };
            // var item = [];
            var item = JSON.parse(sres.text).map(function(index, key) {
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
