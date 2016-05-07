var express = require('express');
var router = express.Router();

var nicolive = require('../nicolive.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NicoNicoCommentViewer' });
});
router.post('/', function(req, res, next){
    var broadcastUrl = req.body.url;
    console.log(broadcastUrl);
    var lv = broadcastUrl.split("/");
    lv = lv[lv.length-1].split("?")[0];
    
    var user_session = req.cookies.user_session;
    
    nicolive.fetchThread(lv,user_session,function(error,thread){
        if(error!=null) throw error;
        nicolive.view(thread,function(error,viewer){
            if(error!=null) throw error;
            viewer.on('data',function(data){
                console.log(data);
            });
        });
    });
    res.render('index', { title: 'NicoNicoCommentViewer' });
});

module.exports = router;