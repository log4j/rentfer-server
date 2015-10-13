var express = require('express');
var router = express.Router();
var config = require('../config');
var Message = require('../proxy').Message;

exports.getUnreadMessageSize = function (req, res, next){
    
    
    Message.getUnreadMessageSize(req.user.id, function(err, size){
        res.jsonp({size:size}); 
    });
};

exports.sendMessage = function (req, res, next) {

    var data = {};
    
	data.image = req.query.image;
    data.to = req.query.to;
    data.content = req.query.content;
    data.from = req.user.id;
    
    
    Message.newAndSave(data, function(err, data){
        var result = {};
        
        if(err){
            result.result = false;
        }else{
            result.result = true;   
        }
        if(err){
            result.message = data.message;    
        }
        
        console.log(JSON.stringify(err)+" data:"+JSON.stringify(data));
        
        res.jsonp(result);
    });

};

/**
 * get the message list related to someone(id)
 */ 
exports.getMessageWith = function (req,  res, next){
    var targetId = req.query.id;

    Message.getMessageWith(req.user.id, targetId, function(err, results){
        if(err)
            res.jsonp([]);
        else
            res.jsonp(results);
    });
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
exports.getRecentContact = function (req, res, next){
    
    Message.getRecentContact(req.user.id, function(err, results){
        console.log(err);
        if(err)
            res.jsonp([]);
        else
            res.jsonp(results);
    });
    
};



