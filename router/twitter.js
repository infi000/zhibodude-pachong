var express = require("express");
var cheerio = require("cheerio");
var eventproxy = require("eventproxy");
var path = require("path");
var superagent = require("superagent");
var fs = require("fs");
var https = require("https");

var website = "https://twitter.com/infi00002/lists/player/members";
var router = express.Router();
var ep = new eventproxy();

router.get("/:id", function(req, res, next) {
    if (req.params.id == "1") {
        superagent.get(website)
            .end(function(err, sres) {
                if (err) {
                    return next(err);
                }
                //加载并且转码
                var $ = cheerio.load(sres.text, { decodeEntities: false });
                var items = [];
                var urllist = [];
                $("#stream-items-id .js-stream-item[data-item-type='user']").each(function(index, element) {
                    var $element = $(element);
                    var _player = $element.find(".fullname").html();
                    var _info = $element.find(".bio").html();
                    var _headurl = $element.find(".avatar").attr("src");//图片源的地址
                    var _head = _headurl.split("/").pop();//图片的名字
                    items.push({
                        player: _player,
                        info: _info,
                        head: _head,
                        headurl: _headurl,
                    });
                    //保存球员地址到数组，准备调用
                    urllist.push(["https://twitter.com/" + _player,_player]);
                    //加载保存img
                    dlimg(_headurl, "../public/img", _head);
                });
                //写如文件夹内
                fs.writeFile("./public/data/twitter-user.json", JSON.stringify(items), function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("写入成功twitter-user.json！")
                    }
                });
                res.send(items);
            });
        //eq控制并发
        eq.after("open", urllist.length, function(data) {
            for (var index; index in data) {
                var _player = index[0];
                var text = index[1];
                var $ = cheerio.load(text, { decodeEntities: false });
                var _banner=$(".ProfileCanopy-headerBg img").attr("src");//img
                var _head=$(".ProfileAvatar-image").attr("src");//img
                var _twitter=[];
                $("#stream-items-id js-stream-item[data-item-type='tweet']").each(function(index,element){
                    var $element=$(element);
                    _twitter.push({
                        thead:$element.find(".avatar").attr("src"),//img
                        name:_player,
                        time:$element.find("._timestamp").html(),
                        msg:$element.find(".tweet-text").html(),
                        img:$element.find(".js-adaptive-photo").attr("data-image-url"),//img
                    })
                });
                var json={
                    player:_player,
                    banner:_banner,//img
                    head:_head,//img
                    twitter:_twitter
                };
                console.log(json);
                //写入data中
                fs.writeFile("./public/data/"+_player+".json",JSON.stringify(json),function(err){
                    if(err){
                        console.error(err);
                    }else{
                        console.log("写入"+_player+".json。成功！")
                    }
                })
            };
        });
        //遍历获取每一个链接参数
        urllist.forEach(function(url) {
            var _url=url[0];
            var _player=url[1];
            superagent.get(_url).end(function(err, ssres) {
                if (err) {
                    return next(err);
                };
                console.log("获取：" +_player+"地址："+ _url + "成功");
                eq.emit("open", [_player, ssres.text]);
            })
        });

    };
});
//下载图片
function dlimg(url, fp, name) {
    console.log("程序执行");
    var imageData = "";
    https.get(url, function(res) {
        res.setEncoding("binary");
        console.log("tupian 获取");
        res.on("data", function(chunk) {
            imageData += chunk;
        });
        res.on("end", function() {
            console.log("图片下载成功！");
            //保存图片
            var filename = path.join(__dirname, fp, name);
            fs.writeFile(filename, imageData, "binary", function(err) {
                console.error(err)
            });
        });
        res.on("error", function(error) {
            console.error(err)
        })
    })

};

module.exports = router;
