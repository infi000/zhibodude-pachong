/*
 * @Author: 张驰阳
 * @Date:   2016-12-27 10:03:03
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2016-12-27 15:36:38
 */

'use strict';

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var fs = require("fs");
var eventproxy = require("eventproxy");
var eq = new eventproxy();
var website = "http://nba.tmiaoo.com/body.html";
var url = require("url");
var date = function(num) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + num); //国外加一天
    var year = oDate.getFullYear(); //获取系统的年；
    var month = oDate.getMonth() + 1; //获取系统月份，由于月份是从0开始计算，所以要加1
    var day = oDate.getDate(); // 获取系统日，
    return year + "-" + month + "-" + day
};

var router = express.Router();

router.get("/:id", function(req, res) {
    if (req.params.id == "1") {
        superagent.get(website).end(function(err, sres) {
            if (err) {
                return next(err);
            };
            var _$ = cheerio.load(sres.text, { decodeEntities: false });
            var m = _$(".game-container-inner").find("script").attr("src");
            superagent.get(m).buffer().end(function(err, _sres) {
                var text = _sres.text.replace('document.write("', "");
                text = text.replace(/[\\]/g, '');
                text = text.substring(0, text.length - 3);
                var $ = cheerio.load(text, { decodeEntities: false });
                var items = [];
                var urllist = [];
                $(".game-item").each(function(index, element) {
                    var $element = $(element);
                    var desc = $element.find(".desc font").html();
                    if (desc == "NBA常规赛") {
                        // NBA常规赛: 鹈鹕 vs 76人
                        var time1 = $element.find(".team span").eq(0).html();
                        var time2 = $element.find(".team span").eq(1).html();
                        var title = "NBA常规赛: " + time1 + " vs " + time2;
                        var href = $element.find("a").attr("href").split("?")[0] + "/p.html";
                        // var href = $element.find("a").attr("href");
                        items.push({
                            title: title,
                            href: href

                        });
                        //保存对阵和地址到数组
                        urllist.push([href, title]);
                    }
                });

                //eq控制并发
                eq.after("open", urllist.length, function(data) {
                        var jrs = [];
                        for (var index in data) {
                            var macth = data[index][0];
                            var text = data[index][1];
                            var href;
                            var $ = cheerio.load(text, { decodeEntities: false });
                            var o = { macth: macth, line: [] };
                            $(".mv_action a").each(function(idnex, element) {
                                var url = $(element).attr("href");
                                var name = $(element).html();
                                o.line.push({
                                    line: name,
                                    url: url,
                                    type: "iframe"
                                });
                            });
                            jrs.push(o);
                        };
                        // res.send(jrs);
                        fs.writeFile("./public/data/jrs.json", JSON.stringify(jrs), function(err) {
                            if (err) {
                                console.error(err)
                            } else {
                                console.log(date(0) + "写入jrs成功！");
                            }
                        })
                        res.send(jrs);
                    })
                    //遍历获取每个链接参数
                urllist.forEach(function(url) {
                    var _url = url[0];
                    var _macth = url[1];
                    superagent.get(_url).end(function(err, ssres) {
                        if (err) {
                            return console.error(err);
                        };
                        console.log("获取：" + _macth + "完成！");
                        eq.emit("open", [_macth, ssres.text]);
                    });
                })

            });
        });
    };
});

module.exports = router;
