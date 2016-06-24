var app = new Vue({
    el: '#app',
    data: {
        owner_i_src: '',        //コミュサムネのURL
        owner_name: '',         //コミュ主の名前
        broadcast_title: '',    //コミュの放送タイトル名
        commentDetails: [
        ]                       //コメントのデータ
    },
    methods: {
        //コミュサムネの表示
        showImage: function(src){
            this.owner_i_src = src
            var element = document.getElementById("owner_img")
            var img_el = document.createElement("img")
            img_el.setAttribute("src", this.owner_i_src)
            img_el.setAttribute("alt", "コミュサムネ")
            element.appendChild(img_el)
        },
        //コミュ主の表示
        showOwnerName: function(name){
            this.owner_name = name
            var element = document.getElementById("owner_name")
            var name_el = document.createElement("h4")
            name_el.textContent = this.owner_name
            element.appendChild(name_el)
        },
        //コミュの放送タイトルの表示
        showBroadcastTitle: function(title){
            this.broadcast_title = title
            this.$broadcast('broadcast-title-msg', this.broadcast_title);
            /*
            var element = document.getElementById("broadcast_title")
            var title_el = document.createElement("h5")
            title_el.textContent = this.broadcast_title
            element.appendChild(title_el)
            */
        },
        //コミュsサムネの非表示(削除)
        removeImage: function(){
            var element = document.getElementById("owner_img")
            this.removeChild(element)
        },
        //コミュ主の非表示(削除)
        removeOwnerName: function(){
            var element = document.getElementById("owner_name")
            this.removeChild(element)
        },
        //コミュの放送タイトルの非表示(削除)
        removeBroadcastTitle: function(){
            var element = document.getElementById("broadcast_title")
            this.removeChild(element)
        },
        //何これちょっとこれどこに使うのか分かんないんだけど・・・・
        removeChild: function(element){
            while(element.hasChildNodes()){
                element.removeChild(element.firstChild)
            }
        },
        //コメントデータの取得
        addComments: function(commentdata){
            //先頭にコメントデータを追加(表示する関係でpushではなくunshiftを利用)
            this.commentDetails.unshift({user_id: commentdata.user_id, comment: commentdata.comment, premium: commentdata.premium})
        }
    }
})
