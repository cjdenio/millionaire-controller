import Vue from "vue"
import VueSocketIO from "vue-socket.io"

import SocketIO from "socket.io-client"

import "./index.html"
import "./style/style.scss"

import Index from "./views/Index.vue"

// Vue plugins
Vue.use(new VueSocketIO({
    connection: SocketIO()
}))

new Vue({
    el: "#app",
    render: e => e(Index)
})