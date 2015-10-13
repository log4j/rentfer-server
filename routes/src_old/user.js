var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var eventproxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy').User;
var Favorite = require('../proxy').Favorite;
var fs = require('fs');

exports.signIn = function(req, res){
    var data = {};
    data.username = req.query.username;
    data.email = req.query.email;
    data.password = req.query.password;

    User.newAndSave(data, function(err, user){
        var result = {};
        if(err){
            result.result = false;
            result.message = err;
        }else{
            result.result = true;
        }
        res.jsonp(result);
    });
};

exports.jsonGetUserByName = function(req, res){

    User.getUserByName(req.query.name, function(err, user){
        var ret = null;
        if(user){
          ret = {};
          ret.id = user._id;
          ret._id = user._id;
          ret.name = user.name;
          ret.avatar = user.avatar;
        }
        if(req.query.callback){
          res.jsonp(ret);
        }else{
          res.json(ret);
        }

    });
};

exports.updateProfile = function(req, res){
    var data = JSON.parse(req.query.data);
    console.log(JSON.stringify(data));
    data.id = req.user.id;

//    data.firstname = req.query.firstname;
//    data.lastname = req.query.lastname;
//    data.gender = req.query.gender == 'male' || req.query.gender == 'on';
//    if(req.query.birthday)
//        data.birthday = req.query.birthday;
//    if(req.query.smoking)
//        data.smoking = req.query.smoking;
//    if(req.query.drinking)
//        data.drinking = req.query.drinking;
//    if(req.query.driver == 'on')
//        data.driver = true;
//    if(req.query.cooking)
//        data.cooking = req.query.cooking;
//    if(req.query.pet == 'on')
//        data.pet = true;
//    if(req.query.desc)
//        data.desc = req.query.desc;
//    if(req.query.seeking)
//        data.seeking = req.query.seeking;
//    if(req.query.start)
//        data.rent_start = req.query.start;
//    if(req.query.end)
//        data.rent_end = req.query.end;
//    if(req.query.max_roommates)
//        data.max_roommates = req.query.max_roommates;


    console.log(JSON.stringify(data));

    User.update(data, function(err){
        var result = {};
        if(err){
            result.result = false;
        }else{
            result.result = true;
        }
        res.jsonp(result);
    });
};

exports.searchUser = function(req, res){
    var query = {};
    if(req.query.data)
        query = JSON.parse(req.query.data);

    console.log(req.query.data);

    User.searchUser(query, function(err, data){
        var list = [];
        for(var i=0;i<data.length;i++){
            var obj = {};
            var item = data[i];
            obj.id = item.id;
            obj.u = item.username;
            obj.f = item.firstname;
            obj.l = item.lastname;
            obj.g = item.gender;
            //console.log(item.gender);
            obj.a = item.avatar;
            obj.h_v = item.habit_visible;
            obj.b_v = item.basic_visible;
            obj.d = item.rent_duration;
            obj.r_s = item.rent_start;
            list.push(obj);
        }
        res.jsonp(list);
    });
};


exports.getUser = function(req, res){
    var id = req.query.id;

    console.log("get user id="+id);

    User.getUserById(id, function(err,user){
        var obj = {};
        obj.id = user.id;
        obj.avatar = user.avatar;
        obj.firstname = user.firstname;
        obj.lastname = user.lastname;
        obj.username = user.username;
        obj.gender = user.gender;
        if(user.basic_visible){
            obj.birthday = user.birthday;
        }
        if(user.habit_visible){
            obj.smoking = user.smoking;
            obj.drinking = user.drinking;
            obj.driver = user.driver;
            obj.cooking = user.cooking;
            obj.pet = user.pet;
            obj.desc = user.desc;
        }

        obj.seeking = user.seeking;
        obj.rent_start = user.rent_start;
        obj.rent_end = user.rent_end;
        obj.rent_duration = user.rent_duration;
        obj.max_roommates = user.max_roommates;
        obj.basic_visible = user.basic_visible;
        obj.habit_visible = user.habit_visible;

        res.jsonp(obj);

    });
};

/**
 * get user infor and present Profile page
 */
exports.show_profile = function(req, res, next){
    res.render('profile',{title:'Profile'});
};


exports.avatar_upload = function (req, res, next) {
  //res.json({result:'hell'});
  //return;

  console.log(JSON.stringify(req.files));

  var result = {};
  result.result = 'true';
  var image = "avatar_"+req.files.file.name;


     // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = './public/images/' + 'avatar' +'/'+ image;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件,
        //fs.unlink(tmp_path, function(err){
            if(err) {
              res.json({result:'false'});
            }
            else {
              //update user
              User.getUserById(req.user.id,function(err,user){
                user.avatar = image;
                user.save(function(err,updateduser){
                  res.json({result:'true',image:image});
                });
              });
            };
        //});
    });



  //console.log("message");

  //res.json({result:'hell'});
};


exports.addFavorite = function (req, res,next){
    var data = {
        type: req.query.type,
        id: req.query.id,
        title: req.query.title
    };
    data.user = req.user.id;

    if(req.query.image)
        data.image = req.query.image;

    Favorite.newAndSave(data,function(err){
        if(err)
            res.jsonp({result:false,err:err});
        else
            res.jsonp({result:true});
    });

};

exports.getFavoriteList = function(req, res, next){
    Favorite.findByUser(req.user.id, function(err, list){
        var result = [];
        for(var i=0;i<list.length;i++){
            var obj = {
                id: list[i].id,
                type: list[i].type,
                title: list[i].title,
                image: list[i].image,
                date: list[i].create_at,
                item_id: list[i].item_id
            };
            result.push(obj);
        }

        res.jsonp(result);
    });
};
