/**
 * Created by yangmang on 9/7/15.
 */


var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Results = require('./commonResult');

var Secondhand = require('../models').Secondhand;


var fs = require('fs');


exports.createItem = function (req, res, next) {


    console.log(req.body);

    var item = new Secondhand();
    //item.user = req.user.id;
    item.title = req.body.title;
    item.type = req.body.type;
    item.price = req.body.price;
    item.location = req.body.location;
    item.description = req.body.description;
    item.images = req.body.images.slice(0);

    item.save(function(err,savedItem){
        if(err){
            res.json({ab:'haha'});
        }
        else{
            res.json({result:true,data:savedItem});
        }
    });
};

exports.updateItem = function (req, res, next) {
    var itemId = req.param('id');
    if (itemId) {
        Secondhand.findById(itemId,function(err,item){
            if(err){
                res.json(Results.ERR_DB_ERR);
            }else{

                for(var key in req.body){
                    item[key] = req.body[key];
                }

                item.update_at = new Date();

                item.save(function(saveErr,savedItem){
                    if(saveErr)
                       return res.json(Results.ERR_DB_ERR);
                    else
                        return res.json({result:true,data:savedItem});
                });

            }
        });
    }else{
        res.json(Results.ERR_PARAM_ERR);
    }
};

exports.deleteItem = function (req, res, next) {
    res.json(Results.ERR_DB_ERR);
};

exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        Secondhand.findById(itemId,function(err,item){
            if(err){
                res.json(Results.ERR_DB_ERR);
            }else{
                res.json({result:true,data:item});
            }
        });
    }else{
        res.json(Results.ERR_PARAM_ERR);
    }
};

/**
 * get records list
 * query:
 * page&size&query
 * @param req
 * @param res
 * @param next
 */
exports.getList = function (req, res, next) {

    var page = tools.parsePageQuery(req.query);

    var queryPara = {};

    if (req.query.query) {
        queryPara.title = {"$regex": req.query.query, "$options": i};
    }

    var query = Secondhand.find(queryPara);

    query.skip((page.page - 1) * page.size).limit(page.size);


    query.exec(function (err, list) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
        } else {
            res.json({result: true, data: list});
        }
    });
};

