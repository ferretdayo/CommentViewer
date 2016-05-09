var express = require('express');
var router = express.Router();

var nicolive = require('../nicolive.js');

// ネットを利用
var net = require('net');
var readline = require('readline');
// Dependencies
var request= require('request');
var cheerio= require('cheerio');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'NicoNicoCommentViewer' });
});

router.post('/', function(req, res, next){
    //Postデータの取得
    var email = req.body.email;
    var pass = req.body.password;
    console.log(email);
    console.log(pass);
    //ログイン処理を行った後、render('viewer')
    nicolive.login(email, pass, res);
})

module.exports = router;
