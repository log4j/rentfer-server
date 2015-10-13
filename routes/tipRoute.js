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


exports.getList = function(req, res, next){

};

exports.getOne = function(req, res, next){

};

exports.create = function(req, res, next){

};

exports.update = function(req, res, next){
    res.json({result:true});
};

exports.delete = function(req, res, next){

};
