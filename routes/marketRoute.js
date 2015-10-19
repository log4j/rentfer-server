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

var Market = require('../models').Market;


var fs = require('fs');


exports.createItem = function (req, res, next) {

    console.log(req.body);

    var item = new Market();
    item.user = req.user.id;

    item.title = req.body.title;
    item.type = req.body.type;
    item.price = req.body.price;
    item.location = req.body.location;
    item.description = req.body.description;
    item.images = req.body.images.slice(0);
    //item.user = req.us
    console.log(item);

    item.save(function(err,savedItem){
        if(err){
            res.json({result:false,err:err,ab:'haha'});
        }
        else{
            res.json({result:true,data:savedItem});
        }
    });
};

exports.updateItem = function (req, res, next) {
    var itemId = req.param('id');
    if (itemId) {
        Market.findById(itemId,function(err,item){
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
        var query = Market.findById(itemId);
        query.populate('user','lastname avatar');
        query.exec(function(err,item){
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

    var queryPara = {delete:false};

    if (req.query.query) {
        queryPara.title = {"$regex": req.query.query, "$options": i};
    }

    console.log(req.user);
    if(req.query.owner === 'self'){
        queryPara.user = req.user._id;
    }

    var query = Market.find(queryPara);
    query.sort({update_at:-1});
    query.skip(page.start).limit(page.size);

    query.populate('user','lastname avatar');

    query.exec(function (err, list) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
        } else {
            res.json({result: true, data: list});
        }
    });
};

