var express=require("express");
var cheerio=require("cheerio");
var superagent=require("superagent");
var fs=require("fs");

var website="https://twitter.com/infi00002/lists/player";
var router=express.Router();

router.get("/:id",function(req,res,next){
	if(req.params.id=="1"){
		superagent.get(websit)
			   .end(function(err,sres){
			   	if(err){
			   		return next(err);
			   	}
			   	//加载并且转码
			   	var $=cherrio.load(sres.text, { decodeEntities: false });
			   	var items=[];
			 res.send($("#stream-items-id .js-stream-item[data-item-type='tweet']").html())
			   })	
	}
	
});

module.exports = router;