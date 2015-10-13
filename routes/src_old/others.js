var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');



exports.example = function (req, res, next) {

	console.log('in exports.dashboard');

	res.render('example', { title: 'Express' });
};


exports.image_upload = function (req, res, next) {


	console.log("message");

	res.json({result:'hell'});
};

exports.image_upload_tip = function (req, res){
    
    var image = "tip_"+req.files.file.name;


     // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/' + 'tip' +'/'+ image;
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
    
    
};