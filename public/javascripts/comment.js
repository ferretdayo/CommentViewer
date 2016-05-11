var socket = io.connect('http://localhost:3001');
//var socket = new io.Socket('localhost');
socket.connect();

socket.on('broadcast data', function(data){
    //放送タイトルや放送者の情報の初期化
    broadcastTitleInit();
    //放送タイトルや放送者の情報をコメビュに表示
    setBroadcastTitle(data);
});

socket.on('comment data', function(msg){
    //コメントデータを形成
    var commentData = dataAnalyze(msg);
    if(commentData != -1){
        $('#comment').prepend($('<tr><td>' + commentData.user_id + '</td><td>' + commentData.comment + '</td><td>' + commentData.premium + '</td></tr>'));
    }
});

socket.on('disconnect', function(){
    console.log("放送終わりました");
})

$("#submit").click(function(){
    socket.emit('disconnect broadcast');
})

//放送情報を表示する前に毎回行う初期化
function broadcastTitleInit(){
    //#owner_imgにChildがあればChildを削除
    if($('#owner_img')[0]){
        $('#owner_img').empty();
    }
    if($('#owner_name')[0]){
        $('#owner_name').empty();
    }
    if($('#broadcast_title')[0]){
        $('#broadcast_title').empty();
    }
}

//放送タイトルや放送者情報の表示
function setBroadcastTitle(data){
    //各IDに対するHTMLのChildに情報をappend
    $('#owner_img').append($('<img id="owner_i" src="' + data.owner_img + '">'));
    $('#owner_name').append($('<h4>' + data.owner_name + '</h4>'));
    $('#broadcast_title').append($('<h5>' + data.title + '</h5>'));
}

//コメントデータから表示する為のデータを形成する。
function dataAnalyze(data){
    var commentData = {};
    //コメント情報の場合
    if(data.hasOwnProperty('chat')){
        console.table(data);
        //ユーザIDの取得
        commentData.user_id = data.chat.$.user_id;
        //ユーザの種別
        if(data.chat.$.hasOwnProperty('premium')){
            switch(data.chat.$.premium){
                case "1":
                    commentData.premium = "プレミア";
                    break;
                case "3":
                    commentData.premium = "運営";
                    break;
                default:
                    console.log(data.chat.$.premium);
                    break;
            }
        }else{
            commentData.premium = "一般";
        }
        //コメントの取得
        //TODO /hbから始まるときは表示しないようにする
        commentData.comment = data.chat._;
        //コメントの番号
        commentData.no = data.chat.$.no;
        //コメントの日時
        commentData.date = createDateJST(data.chat.$.date);
        return commentData;        
    }else{
        console.table(data);
        return -1;
    }
}
    
//形成された日時を返却する関数
function createDateJST(timestamp){
    var d = new Date(parseInt(timestamp)*1000);
    return d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}