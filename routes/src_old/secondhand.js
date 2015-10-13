var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');

var Secondhand = require('../proxy').Secondhand;

exports.getSecondhandItem = function (req, res, next) {

	var id = req.query.id;

	Secondhand.getItem(id,function(err, item){
		res.jsonp(item);
	});

};

exports.getSecondhandList = function (req, res, next) {

	var data = {};
	data.date = req.query.date;
	data.type = req.query.type;

	Secondhand.getList(data,function(err, list){
		res.jsonp(list);
	});

};

exports.setSold = function(req, res, next){
    Secondhand.setSold(req.query.id, function(err, list){
        if(err)
            res.jsonp({result:false});
        else
            res.jsonp({result:true});
    });
};

exports.deleteItem = function(req, res, next){
    Secondhand.deleteItem(req.query.id, function(err, list){
        if(err)
            res.jsonp({result:false});
        else
            res.jsonp({result:true});
    });
};

exports.getMySecondhandList = function(req, res, next){
    Secondhand.getMyItems(req.user.id, function(err, list){
        var results = [];
        if(list!=null){
            for(var i=0;i<list.length;i++){
                var obj = {};
                obj.id = list[i].id;
                obj.price = list[i].price;
                obj.title = list[i].title;
                obj.create_at = list[i].create_at;
                obj.sold = list[i].sold;
                results.push(obj);
            }
        }
        res.jsonp(results);
    });
};

//add/edit an item in secondhand
exports.updateSecondhandItem = function (req, res, next){

	var data = {};
	data.user = req.user.id;
	data.title = req.query.title;
	data.type = req.query.type;
	data.price = req.query.price;
    data.location = req.query.location;
	data.description = req.query.description;
	data.images = JSON.parse(req.query.images);

	Secondhand.newAndSave(data,function(err,data){
		var result = {};
		if(err){
			result.result = false;
			result.message = JSON.stringify(err);
		}else{
			result.result = true;
			result.id = data._id;
		}
		res.jsonp(result);
	});

};

exports.image_upload = function (req, res, next) {
	//res.json({result:'hell'});
	//return;

	console.log(JSON.stringify(req.files));

	var result = {};
	result.result = 'true';
	var image = "seconhand_"+req.files.file.name;


     // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/' + 'secondhand' +'/'+ image;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        //fs.unlink(tmp_path, function(err){
            if(err) {
            	res.json({result:'false'});
            }
            else {
            	res.json({result:'true',image:image});

            };
        //});
    });



	//console.log("message");

	//res.json({result:'hell'});
};



function saveImage(file,path,newName,callback){
     // 获得文件的临时路径
    var tmp_path = file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/' + path +'/'+ newName;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        fs.unlink(tmp_path, callback(err));
    });
};