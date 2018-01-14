var express = require("express"),
    WebSocket = require("uws"),
    https = require('https'),
    forceSsl = require('express-force-ssl'),
    cors = require('cors'),
    fs = require('fs')
    config = require(__dirname + "/config.json");

var appResources = config.webRoot.indexOf("/") === 0 ? config.webRoot : __dirname + "/" + config.webRoot,app = express(),
    server = app.listen(config.port),
    wss = new WebSocket.Server({
        server: server
    });
app.use(forceSsl)
app.use(cors())
app.use("/", express.static(appResources));
console.log("Server listening on port " + config.port);

var allConnectedSockets = [];
var allConnectedSocketsInRoom = [];
var messagetype={
    "MOVEMENT":1,
    "ATTACK":4,
    "JUMP":5,
    "SHOOT":6
  };
wss.on("connection", function (socket) {
    allConnectedSockets.push(socket);

    socket.on("message",onMessage)

    function onMessage(data){
        if(data==messagetype.MOVEMENT){
          socket.send("3");
          console.log(data)
        }else if(data==messagetype.ATTACK){
            socket.send("2")
        }
        allConnectedSockets.forEach(function (someSocket) {if (someSocket !== socket) {someSocket.send(data);}});
      };
    socket.on("close", function () {
        var idx = allConnectedSockets.indexOf(socket);
        allConnectedSockets.splice(idx, 1);
    });
});
