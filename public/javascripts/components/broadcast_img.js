var BroadcastImg = Vue.extend({
    template: '<img src="{{broadcast_img}}" alt="放送サムネ" width="50px" height="50px">',
    data: function (){
        return {
            broadcast_img: ''
        }
    },
    events: {
        'broadcast-img-msg' : function(img){
            console.log("events");
            // URLの先頭のhttp:を削除
            img = img.replace(/http:/g, "");
            this.broadcast_img = img;
        }
    }
});

Vue.component('broadcast-img', BroadcastImg);
