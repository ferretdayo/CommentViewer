var app_broadcastdetails = new Vue({
    el: '#app_broadcastdetails',
    data: {
        owner_i_src: '',
        owner_name: '',
        broadcast_title: ''
    },
    methods: {
        showImage: function(src){
            this.owner_i_src = src
            var element = document.getElementById("owner_img")
            var img_el = document.createElement("img")
            img_el.setAttribute("src", this.owner_i_src)
            img_el.setAttribute("alt", "コミュサムネ")
            element.appendChild(img_el)
        },
        showOwnerName: function(name){
            this.owner_name = name
            var element = document.getElementById("owner_name")
            var name_el = document.createElement("h4")
            name_el.textContent = this.owner_name
            element.appendChild(name_el)
        },
        showBroadcastTitle: function(title){
            this.broadcast_title = title
            var element = document.getElementById("broadcast_title")
            var title_el = document.createElement("h5")
            title_el.textContent = this.broadcast_title
            element.appendChild(title_el)
        },
        removeImage: function(){
            var element = document.getElementById("owner_img")
            this.removeChild(element)
        },
        removeOwnerName: function(){
            var element = document.getElementById("owner_name")
            this.removeChild(element)
        },
        removeBroadcastTitle: function(){
            var element = document.getElementById("broadcast_title")
            this.removeChild(element)
        },
        removeChild: function(element){
            while(element.hasChildNodes()){
                element.removeChild(element.firstChild)
            }
        }
    }
})
