/*
 * @Author: 张驰阳
 * @Date:   2016-12-19 11:47:32
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-01-09 18:03:27
 */

'use strict';

var express = require("express");
var cheerio = require("cheerio");
var superagent = require("superagent");
var fs = require("fs");

var app = express();

var gamefile = require("./router/gamefile");
var twitter = require("./router/twitter");
var getjson = require("./router/getjson");
var wenzi = require("./router/3g");
var jrs = require("./router/jrs");
var hupu = require("./router/hupu");
//设置跨域访问
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
});

app.use("/gamefile", gamefile);
app.use("/twitter",twitter);
app.use("/getjson",getjson);
app.use("/wenzi",wenzi);
app.use("/jrs",jrs);
app.use("/hupu",hupu);
// app.use("/static",express.static("public/img"));
app.use("/static/img",express.static("public/img"));
app.listen("3000", function() {
    console.log("启动。。。。")
})
