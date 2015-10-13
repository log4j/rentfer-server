var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Apartment = require('../proxy').Apartment;
var fs = require('fs');



exports.showList = function (req, res, next) {
    Apartment.findAll(function(err, list){
        if(err)
            return next();
        else
            res.render("apartmentlist",{title:"Apartment List",list:list});
    });
};


exports.getApartment = function (req, res, next){
    var id = req.query.id;
    
    Apartment.findById(id,function(err, apart){
        if(!err){
            res.jsonp(apart);
        }else{
            res.jsonp({});
        }
    });
};

/**
 * get the list of apartments
 * this is used for mobile 
 */ 
exports.searchList = function (req, res, next) {
    var lo1 = req.query.lo1;
    var lo2 = req.query.lo2;
    var la1 = req.query.la1;
    var la2 = req.query.la2;

    var result = {};
    result.size = 0;
    result.aparts = [];

    Apartment.findAll(function(err, list){
        if(!err){
            for(var i=0;i<list.length;i++){
                if(lo1<=list[i].longitude
                    &&lo2>=list[i].longitude
                    &&la1<=list[i].latitude
                    &&la2>=list[i].latitude){
                    result.aparts.push(list[i]);
                    result.size ++;
                }
                
            }
        }
        res.jsonp(result);
    });

};

exports.showEdit = function(req, res){
    var id = req.param('id');
    
    if(id){
        Apartment.findById(id,function(err, apart){
             res.render("apartmentedit",{title:'Apartment Edit',apart:apart});
        });
    }else{
        res.render("apartmentedit",{title:'Apartment Edit',apart:null});
    }
    
    
};

function randomImageFileName(){
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

exports.edit = function(req, res){

    var id = req.param('id');
    
    var data = {};
    data.name = req.body.name;
    data.address = req.body.address;
    data.city = req.body.city;
    data.state = req.body.state;
    data.zipcode = req.body.zipcode;
    data.tags = req.body.tags;
    data.desc = req.body.desc;
    data.longitude = req.body.longitude;
    data.latitude = req.body.latitude;
    
    
    var imagePrefix = data.name.replace(/ /g,'_')+'_';
    
    //gather information
    var apartImageCounter = parseInt(req.body.apartimagecounter);
    var apartImages = [];
    for(var i=0;i<=apartImageCounter;i++){
        if(req.body['apartimagedesc'+i]){
            var dataItem = {};
            dataItem.file = req.files['apartimagefile'+i];
            dataItem.desc = req.body['apartimagedesc'+i];
            dataItem.image = imagePrefix+dataItem.file.name;
            apartImages.push(dataItem);
        }
    }
    
    var roomInfoCounter = parseInt(req.body.roominfocounter);
    var roomTypes = [];
    for(var i=0;i<=roomInfoCounter;i++){
        if(req.body['roominfotype'+i]){
            var dataItem = {};
            dataItem.file = req.files['roominfofile'+i];
            dataItem.type = req.body['roominfotype'+i];
            dataItem.price = req.body['roominfoprice'+i];
            dataItem.image = imagePrefix+dataItem.file.name;
            roomTypes.push(dataItem);
        }
    }
    
    var ep = new EventProxy();
    ep.all("saveFeatureImage","saveApartImage","saveRoomImage","updateApart",
           function(){
        //res.send("OK");
        
        if(id){
            res.render('result',{title:'提示',content:'更新成功!',link:'/apartment/list'});
        }else{
            res.render('result',{title:'提示',content:'添加成功!',link:'/apartment/list'});
        }
    });
    ep.fail(function(err){
        res.send("ERROR:"+err);
    });
    
    data.facilities = apartImages;
    data.rents = roomTypes;
    
    
    if(id&&data.image==null){
        ep.emit("saveFeatureImage");
    }else{
        data.image = imagePrefix+req.files.descimage.name;
        saveImage(req.files.descimage,'apartments',data.image,
                  function(err){
            if(err) ep.emit("error");
            else ep.emit("saveFeatureImage");
        });
    }
    
    
    
    //save image
    var apartimageloops = new EventProxy();
    apartimageloops.after('saveOneImage', apartImages.length,function(result){
        ep.emit('saveApartImage');
    });
    for(var i=0;i<apartImages.length;i++){
        
        var file = apartImages[i].file;
        apartImages[i].file = null;
        delete apartImages[i].file;
        saveImage(file,'apartments',apartImages[i].image,
                  function(err){
            if(!err){
                    apartimageloops.emit('saveOneImage');
                }else{
                    apartimageloops.emit('error');
                }
        });
    }
    
    var roominfoloops = new EventProxy();
    roominfoloops.after('saveOneImage', roomTypes.length,function(result){
        ep.emit('saveRoomImage');
    });
    for(var i=0;i<roomTypes.length;i++){
        var file = roomTypes[i].file;
        roomTypes[i].file = null;
        delete roomTypes[i].file;
        saveImage(file,'apartments',roomTypes[i].image,
                  function(err){
            if(!err){
                    roominfoloops.emit('saveOneImage');
                }else{
                    roominfoloops.emit('error');
                }
        });

    }
    
    if(id){
        //edit
        
        Apartment.findById(id,function(err, apart){
            
            apart.name = req.body.name;
            apart.address = req.body.address;
            apart.city = req.body.city;
            apart.state = req.body.state;
            apart.zipcode = req.body.zipcode;
            apart.tags = req.body.tags;
            apart.desc = req.body.desc;
            apart.longitude = req.body.longitude;
            apart.latitude = req.body.latitude;
            
            
            var todel = [];
            for(var i=0;i<apart.rents.length;i++){
                if(req.body[apart.rents[i].image]){
                    todel.push(apart.rents[i]);
                }
            }
            for(var i=0;i<todel.length;i++){
                apart.rents.remove(todel[i]);   
            }
            for(var i=0;i<data.rents.length;i++){
                apart.rents.push(data.rents[i]);   
            }
            
            apart.save(function(err){
                if(err)
                    res.send("ERRRRR");
                else
                    ep.emit('updateApart');
                    //ep.emit('updateApart');
                    //res.render('result',{title:'提示',content:'更新成功!',link:'/apartment/list'});
                    //res.send("update finished <a href='/apartment/list'>Back to List</a>");
            });
            
        });
        
    }else{
        //create
        Apartment.newAndSave(data, function(err, result){
            ep.emit('updateApart');
        });
    }
    
    
    
}