/**
 * Created by yangmang on 9/7/15.
 */


var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');


/**
 * upload one image, return image file name if success
 * @param req
 * @param res
 * @param next
 */
exports.uploadImage = function (req, res, next) {

    console.log(JSON.stringify(req.files));

    var prefix = 'image';

    prefix = req.query.type;


    var image = prefix + "_"+req.files.file.name;

    // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = './public/images/' + prefix +'/'+ image;
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
    });

};
