var BroadcastImg = Vue.extend({
    template: '<img src="{{broadcast_img}}" alt="放送サムネ">',
    data: function (){
        return {
            broadcast_img: ''
        }
    },
    events: {
        'broadcast-img-msg' : function(img){
            console.log("events");
            this.broadcast_img = img;
        }
    }
});

Vue.component('broadcast-img', BroadcastImg);
