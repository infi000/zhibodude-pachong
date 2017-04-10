var express = require("express");
var superagent = require("superagent");
var router = express.Router();
var userInfo = { location: { lng: "116.2966620551215", lat: "39.91420844184028" }, tvmid: "wxh5869094bcd5e25613fe53591" };
var bid_arr = []; //大楼ID列表
var html = "";
var url = {
    su: 'https://nearby-app.yaotv.tvm.cn/g/set_user_info?userInfo=%7B"tvmid"%3A"wxh5869094bcd5e25613fe53591"%7D', //验证
    qub: "https://nearby-app.yaotv.tvm.cn/g/q_user_buildings?tvmid=wxh5869094bcd5e25613fe53591&token=", //大楼列表信息
    gr: "https://nearby-app.yaotv.tvm.cn/g/get_rent?tvmid=wxh5869094bcd5e25613fe53591&token=", //收租tvmid token id大楼ID
    cs: "https://nearby-app.yaotv.tvm.cn/index.php?s=bdtech/more_collection_sunshine" //收花（POST请求 tvmid,token,bid,tid=6）
};
router.get("/:id", function(req, res) {
    var s = req.params.id || "1";
    var init = new Init(res);
    var click = function() {
        if (s == 1) {
            init.yz();
            setTimeout(function() {
                click();
            }, 1000 * 60*6)
        } else {
            return
        }
    };
    click();
});

function Init(x) {
    var that = this;
    this.res = x;
    this.yz = function() {
        superagent.get(url.su).end(function(err, res) {
            if (err) {
                return console.error(err);
            };
            var token = JSON.parse(res.text).token;
            userInfo.token = token;
            bl();
        });
    };
    //获取大楼列表
    function bl() {
        superagent.get(url.qub + userInfo.token).end(function(err, res) {
            if (err) {
                return console.error(err);
            };
            var blist = JSON.parse(res.text).blist;
            for (var i = 0; i < blist.length; i++) {
                bid_arr[i] = blist[i].id;
            }
            rent();
        });

    };
    //收租
    function sz(i) {
        var u = url.gr + userInfo.token + '&id=' + i;
        superagent.get(u).end(function(err, res) {
            if (err) {
                return console.error(err);
            };
            console.log("大楼ID：" + i, "收租：" + res.text);
            // var obj = '<p>大楼<span style="color:red">' + i + '</span>：';
            // obj += '<b>金币：</b><span style="color:blue">' + JSON.parse(res.text).money.coin + '</span> ';
            // obj += ' <b>余额：</b><span style="color:blue">' + JSON.parse(res.text).money.bal + '</span></p>';
            // html += '<li>' + obj;
            sh(i);
        });

    };
    //收花
    function sh(i) {
        var u = url.cs;
        superagent.post(u)
            .type('form')
            .send({
                tvmid: userInfo.tvmid,
                token: userInfo.token,
                bid: i,
                tid: 6
            })
            .end(function(err, res) {
                if (err) {
                    return console.error(err);
                };
                console.log(res.text);
                // var obj = '<p>大楼<span style="color:red">' + i + '</span>：';
                // if (JSON.parse(res.text).code == "200") {
                //     obj += '收花<span style="color:blue"' + JSON.parse(res.text).data.num + '</span>朵';
                // } else {
                //     obj += JSON.parse(res.text).msg;
                // };
                // obj += '</p>';
                // html += obj + '</li>';
            });
    };

    function rent(x) {
        var arr = bid_arr,
            l = arr.length,
            i = x || 0;
        if (i < l) {
            sz(arr[i]);
            i++;
            setTimeout(function() { rent(i) }, 500)
        } else {
            console.log("over",new Date())
            // that.res.send("<ul>" + html + "</ul>");
        }
    };
}
module.exports = router;
