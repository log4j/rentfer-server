var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Results = require('./commonResult');

var User = require('../models').User;
var Tip = require('../models').Tip;


var fs = require('fs');

var md5 = require('MD5');

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


exports.getList = function(req, res, next){
    var data = {};
    if (req.query.date)
        data.date = req.query.date;
    if (req.query.type)
        data.type = req.query.type;
    //if (req.query.language)
    //    data.language = req.query.language;

    Tip.find(data, function (err, list) {
        var result = [];
        if (!err) {
            for (var i = 0; i < list.length; i++) {
                result.push(createSimpleEntity(list[i]));
            }
        }
        res.json(result);
    });
};

exports.getOne = function(req, res, next){
    var id = req.param('id');
    Tip.findById(id, function(err, item){

        item.view_amount ++;
        item.update_at = new Date();
        item.save(function(){
            var obj = createSimpleEntity(item);
            obj.paras = [];
            for(var i=0;i<item.paragraph.length;i++)
                obj.paras.push(item.paragraph[i]);

            res.json(obj);
        });


    });
};

exports.create = function(req, res, next){

};

exports.update = function(req, res, next){
    res.json({result:true});
};

exports.delete = function(req, res, next){

};
