//コメントデータから表示する為のデータを形成する。
function dataAnalyze(data){
    var commentData = {};
    //コメント情報の場合
    if(data.hasOwnProperty('chat')){
        console.table(data.chat);
        // ユーザIDの取得
        // ユーザIDから以下を判定
        // 1. 184じゃない人, 2. 184, 3. クルーズ
        commentData.user_id = getUserRole(data.chat.$.user_id, data.chat.$.premium);
        // プレミア情報よりユーザの種別
        if(data.chat.$.hasOwnProperty('premium')){
            switch(data.chat.$.premium){
                // プレミアの場合
                case ACCOUNT_TYPE.PREMIUM:
                    commentData.type = ACCOUNT_TYPE_NAME.PREMIUM;
                    break;
                // 運営の場合
                case ACCOUNT_TYPE.ADMIN:
                    commentData.type = ACCOUNT_TYPE_NAME.ADMIN;
                    break;
                default:
                    console.log(data.chat.$.premium);
                    break;
            }
        // 一般の場合
        }else{
            commentData.type = ACCOUNT_TYPE_NAME.NORMAL;
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

// UserIDとプレミアかどうかよりユーザの種別(184, !184, クルーズ, 運営)を分けてユーザ名またはIDを返す
function getUserRole(user_id, premium){

    // 運営の場合はプレミアの情報('3')で分かるので、そこより判別
    if(premium !== undefined && premium === ACCOUNT_TYPE.ADMIN){
        return ADMIN_USER;
    }
    // 184じゃない場合
    if(user_id.match(/^[0-9]*$/) !== null){
        if(user_id === CRUISE_ID){
            return CRUISE_USER;
        } else {
            return user_id;
        }
    // 184の場合
    } else {
        return PRIVATE_USER;
    }
}
