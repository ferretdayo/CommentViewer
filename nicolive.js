// ネットを利用
var net = require('net');
var readline = require('readline');
// Dependencies
var request= require('request');
var cheerio= require('cheerio');
var user_session = "";
var broadcastDetail = {};
// Methods
module.exports = {
    //ログイン処理
    login: function(email, pass, res){
        request.post({
            url: 'https://secure.nicovideo.jp/secure/login',
            form: {
                mail_tel: email,
                password: pass,
            },
        },function(error,response){
            //Rejectされた時
            if(error!=null){
                res.redirect(302, "/");
            }
            //Cookieからuser_sessionのデータを取得
            var session= null;
            var cookies= response.headers['set-cookie'] || [];
            for(var i=0; i<cookies.length; i++){
                var cookie= cookies[i];
                if(cookie.match(/^user_session=user_session/)){
                    session= cookie.slice(0,cookie.indexOf(';')+1);
                }
            }
            //sessionがなかった場合
            if(session==null){
                res.redirect(302, "/");
            }
            //Cookieにユーザのセッション情報を保存
            res.cookie('user_session', session);
            res.redirect(302, "/viewer");
        });
    },
    fetchThread: function(live_id,session,callback){
        request({
            url: 'http://live.nicovideo.jp/api/getplayerstatus/'+live_id,
            headers: {
                Cookie: session,
            },
        },function(error,response){
            if(error!=null) return callback(error);

            //XMLのスクレイピング
            var $= cheerio.load(response.body);
            //各情報をローカルに保存
            broadcastDetail.thread = $('getplayerstatus ms thread').text();
            broadcastDetail.port = $('getplayerstatus ms port').text();
            broadcastDetail.addr = $('getplayerstatus ms addr').text();
            //broadcastDetail.vpos = $('').text();
            broadcastDetail.user_id = $('getplayerstatus user user_id').text();
            //broadcastDetail.ticket = $('').text();
            //broadcastDetail.postkey = $('').text();
            broadcastDetail.premium = $('getplayerstatus user is_premium').text();
            
            //CallBack先に渡す値
            callback(null,{
                port: broadcastDetail.port,
                addr: broadcastDetail.addr,
                thread: broadcastDetail.thread,
                broadcast_data : {
                    title: $('getplayerstatus stream title').text(),
                    owner_name: $('getplayerstatus stream owner_name').text(),
                    owner_img: $('getplayerstatus stream thumb_url').text(),
                    comment_count: $('getplayerstatus stream comment_count').text(),
                },
            });
        });
    },
    view: function(thread,callback){
        var viewer= net.connect(thread.port,thread.addr);
        viewer.on('connect', function(){
            viewer.setEncoding('utf-8');
            viewer.write('<thread thread="'+thread.thread+'" res_from="-5" version="20061206" />\0');

            callback(null,viewer);
        });
    },
    /*
    string ticket = "";
    string server_time = "";
    XmlDocument xdoc = new XmlDocument();
    xdoc.LoadXml(line);
    XmlElement root = xdoc.DocumentElement;
    foreach (XmlAttribute attrib in root.Attributes)
    {
    if (attrib.Name == "ticket")
    {
        ticket = attrib.Value;
    }
    if (attrib.Name == "server_time")
    {
    server_time = attrib.Value;
    }
}
if ((ticket == "") || (server_time == ""))
{
    return false;
}
//コメント処理開始時刻
m_DateTimeStart = DateTime.Now;
//vpos(放送経過時間[sec]*100)を算出
//コメントサーバ開始時間
Int64 serverTimeSpan = Int64.Parse(server_time) - Int64.Parse(m_base_time);
//コメント投稿時間(1コメゲッターなのでここでは0secですね)
Int64 localTimeSpan = GetUnixTime(DateTime.Now) - GetUnixTime(m_DateTimeStart);
string vpos = ((serverTimeSpan + localTimeSpan) * 100).ToString();
    */
    postComment: function(commentdata){
        console.log("comment_no: " + commentdata.no + "\n");
        //postkey取得
        request(
            "http://live.nicovideo.jp/api/getpostkey?thread=" + broadcastDetail.thread + "&block_no=" + (parseInt(commentdata.no) + 1)/100.0
        ,function(error,response, body){
            if(error!=null) return;
            var postkey = response.body;
            console.log("http://live.nicovideo.jp/api/getpostkey?thread=" + broadcastDetail.thread + "&block_no=" + (parseInt(commentdata.no) + 1)/100.0 + "\n");
            console.log(postkey);
            console.log(body);
            
            var viewer= net.connect(broadcastDetail.port,broadcastDetail.addr);
            
            viewer.on('connect', function(){
                viewer.setEncoding('utf-8');
                viewer.write('<thread thread="'+broadcastDetail.thread+'" res_from="-5" version="20061206" />\0');
            });
            
            //コメントの投稿
            viewer.write("<chat thread='" + broadcastDetail.thread + "' vpos='" +  + "' mail='" + commentdata.comment + "' ticket='" + commentdata.ticket + "' user_id='" + broadcastDetail.user_id + "' postkey='" +  + "' premium='" + broadcastDetail.premium + "'></chat>\0");
        });
        
    },    
}