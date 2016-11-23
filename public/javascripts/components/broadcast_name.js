var BroadcastName = Vue.extend({
    template: '<h5>{{broadcast_name}}</h5>',
    data: function (){
        return {
            broadcast_name: ''
        }
    },
    events: {
        'broadcast-name-msg' : function(name){
            console.log("events");
            this.broadcast_name = name;
        }
    }
});

Vue.component('broadcast-name', BroadcastName);
