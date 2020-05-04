var express = require('express');
var path = require('path');

var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http)

var { CasparCG } = require('casparcg-connection')

var casparCG = new CasparCG()

io.on("connection", socket => {
    socket.on("showQuestion", data => {
        casparCG.cgAdd(1, 2, 1, 'templates/millionaire/millionaire', true, data)
    })

    socket.on("cgNext", () => {
        casparCG.cgNext(1, 2, 1)
    })

    socket.on("questionHide", () => {
        casparCG.cgStop(1, 2, 1)
    })

    socket.on("questionUpdate", (d) => {
        casparCG.cgUpdate(1, 2, 1, d)
    })
})

app.use('/static', express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.type('html').sendFile(path.join(__dirname, 'dist/index.html'))
})

http.listen(process.env.PORT || 8000, () => {
    console.log("Server started on port " + process.env.PORT || 8000)
})