var app = new Vue({
    el: '#app',
    data: {
        commentDetails: [
        ]                       //コメントのデータ
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
        }
    }
})
