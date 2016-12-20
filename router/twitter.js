var express = require("express");
var cheerio = require("cheerio");
var superagent = require("superagent");
var fs = require("fs");
var app = express();

var website = "https://twitter.com/infi00002/lists/player/members";
var router = express.Router();

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
                $("#stream-items-id .js-stream-item[data-item-type='user']").each(function(index, element) {
                    var $element = $(element);
                    var _player = $element.find(".fullname").html();
                    var _info = $element.find(".bio").html();
                    var _headurl = $element.find(".avatar").attr("src");
                    _head=_head.split("/").pop()
                    items.push({
                        player: _player,
                        info: _info,
                        head: _head,
                        headurl:_headurl,
                    });
                    dlimg(_headurl,"public/img",_head);
                })
                res.send(items);
            })
    }

});
//下载图片
function dlimg (url, fp, name) {
    var imageData = "";
    app.get(url, function(req, res) {
        res.setEncoding("binary");
        res.on("data", function(chunk) {
            imageData += chunk;
        });
        res.on("end", function() {
            console.log("图片下载成功！")；
                //保存图片
            var filename = path.join(__dirname, fp, name);
            fs.writeFile(filename, imageData, "binary", function(err) {
                console.error(err)
            })

        })；
        res.on("error", function(error) {
            console.error(err)
        })
    })

}

module.exports = router;
