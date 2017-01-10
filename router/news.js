/*
 * @Author: 张驰阳
 * @Date:   2016-12-27 10:03:03
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-10 18:37:59
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var fs = require("fs");
var eventproxy = require("eventproxy");
var eq = new eventproxy();
var website = "http://news.baidu.com/ns?word=%E7%A9%BA%E9%93%81%20%E6%96%B0%E8%83%BD%E6%BA%90&pn=0&ct=0&tn=news&ie=utf-8&bt=0&et=0";
var url = require("url");
var nowDate = function(num) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + num); //国外加一天
    var year = oDate.getFullYear(); //获取系统的年；
    var month = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    if (month < 10) {
        month = "0" + month;
    }
    var day = oDate.getDate(); // 获取系统日，
    if (day < 10) {
        day = "0" + day
    }
    return year + "年" + month + "月" + day + "日";
};

var router = express.Router();

router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        //创建URL数组
        var urlList = [];
        for (var i = 0; i <= 700; i += 50) {
            urlList.push(["http://news.baidu.com/ns?word=%E7%A9%BA%E9%93%81%20%E6%96%B0%E8%83%BD%E6%BA%90&pn=" + i + "&cl=2&ct=0&tn=newsdy&rn=50&ie=utf-8&bt=0&et=0"]);
        };
        //遍历每个链接
        urlList.forEach(function(url) {
                var go = function() {
                    url = url[0];
                    superagent.get(url).buffer()
                        .end(function(err, sres) {
                            if (err) {
                                res.send(err);
                            };
                            console.log("wanc")
                            eq.emit("open", sres.text);
                        })
                };
                go();
                // setTimeout("go", 5000)
            })
            //eq控制并发
        eq.after("open", urlList.length, function(data) {
            var item = [];
            var day = nowDate(0);
            var num = "1";
            // item[day] = {
            //     day: day,
            //     news: []
            // };
            for (var key in data) {
                var text = data[0];
                var $ = cheerio.load(text, { decodeEntities: false });
                $(".result").each(function(index, element) {

                    var $ele = $(element);
                    var title = $ele.find(".c-title a").html();
                    var at = $ele.find(".c-author").html();
                    var _from = at.split("&nbsp;&nbsp;")[0];
                    //时间
                    var _time = at.split("&nbsp;&nbsp;")[1];
                    var _time = _time.split(" ");
                    if (_time.length == 1) {
                        _time = nowDate(0);
                    } else {
                        _time = _time[0];
                    };
                    var link = $ele.find(".c-title a").attr("href");
                    item.push({
                        id: num,
                        title: title,
                        from: _from,
                        date: _time,
                        link: link
                    });
                    num++;
                });
            };
            fs.writeFile("./public/data/news.json", JSON.stringify(item), function(err) {
                if (err) {
                    console.error(err)
                } else {
                    console.log("写入news成功！");
                }
            })
            res.send(item);
        })
    }

});

module.exports = router;

// superagent.get(website).end(function(err, sres) {
//     if (err) {
//         return next(err);
//     };
//     var $ = cheerio.load(sres.text, { decodeEntities: false });
//     var item = [];
//     $(".result").each(function(index, element) {
//         var $ele = $(element);
//         var title = $ele.find(".c-title a").html();
//         var at = $ele.find(".c-author").html();
//         var _from=at.split("&nbsp;&nbsp;")[0];
//         var _time=at.split("&nbsp;&nbsp;")[1];
//         var link = $ele.find(".c-title a").attr("href");
//         item.push({
//             title: title,
//             from:_from,
//             date:_time,
//             link: link
//         });

//     });
//     res.send(item);
// });
