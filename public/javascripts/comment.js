var socket = io.connect('http://localhost:3001');
//var socket = new io.Socket('localhost');
socket.connect();
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