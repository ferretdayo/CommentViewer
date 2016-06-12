var app_comment = new Vue({
    el: '#app_comment',
    data: {
        commentDetails: [
        ]
    },
    methods: {
        addComments: function(commentdata){
            //先頭にコメントデータを追加(表示する関係でpushではなくunshiftを利用)
            this.commentDetails.unshift({user_id: commentdata.user_id, comment: commentdata.comment, premium: commentdata.premium})
        }
    }
})
