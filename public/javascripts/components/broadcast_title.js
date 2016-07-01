var BroadcastTitle = Vue.extend({
    template: '<h5>{{broadcast_title}}</h5>',
    data: function (){
        return {
            broadcast_title: ''
        }
    },
    events: {
        'broadcast-title-msg' : function(title){
            console.log("events");
            this.broadcast_title = title;
        }
    }
});

Vue.component('broadcast-title', BroadcastTitle);
