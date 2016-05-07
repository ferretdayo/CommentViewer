var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NicoNicoCommentViewer' });
});
router.post('/', function(req, res, next){
    var broadcastUrl = req.body.url;
    console.log(broadcastUrl);
    var lv = broadcastUrl.split("/");
    lv = lv[lv.length-1].split("?");
    console.log(lv[0]);
});

// Demonstration
process.nextTick(function(){
    //var udata = userdata.func();
    // Environment
    //var id= udata.mail;
    //var pw= udata.pass;
    //var live_id= 'lv262302758';
    
    // Boot
    /*
    nicolive.login()
    .then(id, pw , function(error, session){
        if(error!=null) throw error;
    }).then(live_id, session, function(error, thread){
        if(error!=null) throw error;
    }).then(thread, function(error, viewer){
        if(error!=null) throw error;
        viewer.on('data', function(data){
            console.log(data);
        })
    });
    */
    /*
    nicolive.login(id,pw,function(error,session){
        if(error!=null) throw error;
        nicolive.fetchThread(live_id,session,function(error,thread){
            if(error!=null) throw error;
            
            nicolive.view(thread,function(error,viewer){
                if(error!=null) throw error;

                viewer.on('data',function(data){
                    console.log(data);
                });
            });
        });
    });
    */
});
module.exports = router;
