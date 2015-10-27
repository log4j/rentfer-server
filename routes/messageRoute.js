/**
 * Created by yangmang on 10/25/15.
 */


var express = require('express');
var config = require('../config');
var Message = require('../models').Message;
var User = require('../models').User;

var tools = require('../common/tools');
var Results = require('./commonResult');



exports.getUnreadMessageSize = function (req, res, next){
    var id = req.param('user');
    Message.find({to:id,read:false}, function(err, list){
        console.log(err);
        if(err)
            res.json(Results.ERR_DB_ERR);
        else
            res.json({result:true,data:list.length});
    });

};

exports.postMessage = function (req, res, next) {
    var message = new Message();
    message.from = req.body.from;
    message.to = req.body.to;
    message.type = req.body.type;
    message.title = req.body.title;
    message.content = req.body.content;
    message.save(function(err, data){
        if(err){
           res.json( {
               result: false,
               err:err
           });
        }else{
            res.json( {
                result: true
            });
        }
    });
};

/**
 * get the message list related to someone(id)
 */
exports.getMessageWith = function (req,  res, next){
    var targetId = req.query.target;
    var user = req.query.self;

    var date = req.query.date;

    var query = { $or:[{from:user,to:targetId},{to:user,from:targetId}]};
    if(date){
        date = new Date(date);
        console.log(date);
        query["create_at"] = {"$gt": date};

        //query = {$and:[query,{"created_at":{"$gt": date}}]}
    }

    Message.find(query).sort( {create_at:1}).exec(function(err, list){
        //console.log(list.length);
        if(err){
            console.log(err);
            return res.json(Results.ERR_DB_ERR);
        }

        //set all the message as readed.
        for(var i=0;i<list.length;i++)
            if(list[i].to == user ){
                list[i].read = true;
                list[i].save(null);
            }
        //Message.update({from:other,to:user,read:false},{$set:{read:true}}

        res.json({
            result: true,
            data:list
        });

    });
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

    var id = req.param("user");

    Message.find({ $or:[{from:id},{to:id}] }).sort( {create_at:-1}).exec(function(err, list){
        if(err)
            res.json(Results.ERR_DB_ERR);
        else{
            var results = [];
            var saved = [];
            var otherIdList = [];


            console.log("list:"+list.length);

            for(var i=0;i<list.length;i++){
                var msg = list[i];
                var otherid = msg.from==id?msg.to:msg.from;
                if(otherid==null)
                    continue;
                if(saved[otherid])
                    continue;
                saved[otherid] = true;
                otherIdList.push(otherid);
                var obj = {};
                obj.id = otherid;
                obj.content = msg.content;
                obj.image = msg.image;
                obj.date = msg.create_at;
                results.push(obj);
            }
            console.log("other list:"+otherIdList.length+" results:"+results.length+" "+JSON.stringify(otherIdList));

            //fill other user's information (avatar & name)
            User.find({_id: {$in:otherIdList}}, function(err, users){
                if(err==null){

                    console.log("user:"+users.length);

                    var usermap = [];
                    for(var i=0;i<users.length;i++)
                        usermap[users[i].id] = users[i];

                    //console.log(users[i]._id);

                    for(var i=0;i<results.length;i++){
                        var user = usermap[results[i].id];
                        results[i].avatar = user.avatar;
                        results[i].lastname = user.lastname;
                        results[i].firstname = user.firstname;
                    }
                }

                res.json({
                    result:true,
                    data: results
                });

            });

        }
    });

};



