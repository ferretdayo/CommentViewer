var app = new Vue({
    el: '#app',
    data: {
        commentDetails: [], //コメントのデータ
        postCommentData: {
            no: 0,
            ticket: '',
            server_time: '',
            comment: ''
        }
    },
    methods: {
        //コミュサムネの表示
        showImage: function(src){
            this.$broadcast('broadcast-img-msg', src);
        },
        //コミュ主の表示
        showOwnerName: function(name){
            this.$broadcast('broadcast-name-msg', name);
        },
        //コミュの放送タイトルの表示
        showBroadcastTitle: function(title){
            this.$broadcast('broadcast-title-msg', title);
        },
        //コメントデータの取得
        addComments: function(commentdata){
            //先頭にコメントデータを追加(表示する関係でpushではなくunshiftを利用)
            this.commentDetails.unshift({user_id: commentdata.user_id, comment: commentdata.comment, premium: commentdata.premium})
        },
        //コメントのNumberを保存
        setCommentNumber: function(number){
            this.postCommentData.no = number
        },
        //放送のチケットとサーバの時間を保存
        setLatestInfo: function(ticket, server_time){
            this.postCommentData.ticket = ticket
            this.postCommentData.server_time = server_time
        },
        //コメントの投稿
        postComment: function(event){
            //コメント投稿の発火
            socket.emit('post comment', this.postCommentData)
            //初期化
            this.postCommentData.comment = ""
        }
    }
})

var socket = io.connect('https://localhost:3001');
socket.connect();

//放送タイトルや放送者情報を表示
socket.on('broadcast data', function(data){
    //放送タイトルや放送者の情報をコメビュに表示
    setBroadcastTitle(data);
});

//コメントを取得して表示を行う
socket.on('comment data', function(msg){
    //コメントデータを形成
    var commentData = dataAnalyze(msg);
    if(commentData != -1){
        //コメントの保存
        app.addComments(commentData);
    }
});

socket.on('disconnect', function(){
    console.log("放送終わりました");
})

$("#submit").click(function(){
    socket.emit('disconnect broadcast');
});

//放送タイトルや放送者情報の表示
function setBroadcastTitle(data){
    //放送コミュのサムネを表示
    app.showImage(data.owner_img);
    //放送コミュの主の名前を表示
    app.showOwnerName(data.owner_name);
    //放送のタイトルを表示
    app.showBroadcastTitle(data.title);
    //放送の今のコメント番号取得
    app.setCommentNumber(data.comment_count);
}
