var express = require('express');
var router = express.Router();
var config = require('../config');
var Message = require('../proxy').Message;
var Tip = require('../proxy').Tip;
var fs = require('fs');
var EventProxy = require('eventproxy');

var createSimpleEntity = function(item) {
    var obj = {};
    obj.id = item.id;
    obj.title = item.title;
    obj.image = item.feature_image;
    obj.view = item.view_amount;
    obj.fav = item.fav_amount;
    obj.type = item.type;
    obj.l = item.language;
    obj.c = item.create_at;
    obj.u = item.update_at;
    return obj;
};


exports.getTipList = function (req, res) {

    var data = {};
    if (req.query.date)
        data.date = req.query.date;
    if (req.query.type)
        data.type = req.query.type;
    //if (req.query.language)
    //    data.language = req.query.language;

    Tip.getTipList(data, function (err, list) {
        var result = [];
        if (!err) {
            for (var i = 0; i < list.length; i++) {
                result.push(createSimpleEntity(list[i]));
            }
        }
        res.jsonp(result);
    });

};


exports.getTipItem = function (req, res) {
    var id = req.query.id;
    Tip.findById(id, function(err, item){
        
        item.view_amount ++;
        item.update_at = new Date();
        item.save(function(){
            var obj = createSimpleEntity(item);
            obj.paras = [];
            for(var i=0;i<item.paragraph.length;i++)
                obj.paras.push(item.paragraph[i]);

            res.jsonp(obj);
        });
        
        
    });
};


exports.initEditTip = function (req, res, next) {

    var id = req.param('id');

    if (id) {
        Tip.findById(id, function (err, tip) {
            res.render('edittip', {
                title: "Edit Tip",
                tip: tip,
                types: config.tip_type,
                maxFilesize: config.image_max_size
            });
        });
    } else {
        res.render('edittip', {
            title: "Edit Tip",
            tip: null,
            types: config.tip_type,
            maxFilesize: config.image_max_size
        });
    }

};

exports.submitEditTip = function (req, res, next) {

    var data = {};
    data.title = req.body.title;
    data.paragraph = JSON.parse(req.body.paragraph);
    data.creator = req.user.id;
    data.type = req.body.type;
    data.language = req.body.language;

    if (req.body.id)
        data.id = req.body.id;

    var ep = new EventProxy();
    ep.all("save_feature_image", function (feature_image_id) {
        if (feature_image_id)
            data.feature_image = feature_image_id;

        if (req.body.id) {
            //update
            Tip.update(data, function (err, result) {
                if (err) {
                    res.render('result', {
                        title: '提示',
                        content: '更新失败!',
                        link: '/tip/list'
                    });
                } else {
                    res.render('result', {
                        title: '提示',
                        content: '更新成功!',
                        link: '/tip/list'
                    });
                }
            });
        } else {
            //create
            Tip.newAndSave(data, function (err, result) {
                if (err) {
                    res.render('result', {
                        title: '提示',
                        content: '添加失败!',
                        link: '/tip/list'
                    });
                } else {
                    res.render('result', {
                        title: '提示',
                        content: '添加成功!',
                        link: '/tip/list'
                    });
                }
            });
        }


    });
    ep.fail(function () {});

    //save the feature image
    if ((!req.body.id) || (req.body.id && req.files.feature_image)) {
        var image = "tip_feature_" + req.files.feature_image.name;
        // 获得文件的临时路径
        var tmp_path = req.files.feature_image.path;
        // 指定文件上传后的目录 - 示例为"images"目录。 
        var target_path = './public/images/' + 'tip' + '/' + image;
        // 移动文件
        fs.rename(tmp_path, target_path, function (err) {
            if (err) {
                return ep.emit('error', err);
            } else {
                ///res.json({result:'true',image:image});
                data.feature_image = image;
                return ep.emit("save_feature_image", image);
            };
        });
    } else {
        return ep.emit("save_feature_image");
    }


    //res.render('edittip',{title:"Edit Tip",tip:null});

};


exports.showList = function (req, res, next) {
    Tip.findAll(function (err, list) {
        if (err)
            return next();
        else
            res.render("tiplist", {
                title: "Tip List",
                list: list,
                types: config.tip_type
            });
    });
};

/**
 * get the message list related to someone(id)
 */
exports.getMessageWith = function (req, res, next) {
    var targetId = req.query.id;

    //TODO
};


/**
 * get recent contacting users
 * containing following information
 *  id
 *  name
 *  avatar
 *  lastContent
 *  lastTime
 *  unread
 */
exports.getRecentContact = function (req, res, next) {

    Message.getRecentContact(req.user.id, function (err, results) {
        if (err)
            res.jsonp([]);
        else
            res.jsonp(results);
    });

};