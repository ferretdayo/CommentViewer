//コメントデータから表示する為のデータを形成する。
function dataAnalyze(data){
    var commentData = {};
    //コメント情報の場合
    if(data.hasOwnProperty('chat')){
        console.table(data.chat);
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
        //コメントの番号の更新
        app.setCommentNumber(data.chat.$.no);
        //コメントの日時
        commentData.date = createDateJST(data.chat.$.date);
        return commentData;
    }else if(data.hasOwnProperty('thread')){
        //放送のチケットとサーバの時間を保存
        app.setLatestInfo(data.thread.$.ticket, data.thread.$.server_time);
        return -1;
    }
}

//形成された日時を返却する関数
function createDateJST(timestamp){
    var d = new Date(parseInt(timestamp)*1000);
    return d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}
