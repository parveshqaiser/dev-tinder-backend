
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const socketServer = http.createServer(app);

const io = new Server(socketServer,{
    cors : {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

let allSocketId = {};

const getReceiverSocketId = (id)=>{
    return allSocketId[id]
}

io.on("connection",(socket)=>{

    console.log("user connected on Socket ID :", socket.id);
    console.log(socket.id);

    let userId = socket.handshake.query.userId;

    if (userId) {
        allSocketId[userId] = socket.id;
    }

    socket.on("requestOnlineUsers", () => {
        socket.emit("getOnlineUsers", Object.keys(allSocketId));
      });

    io.emit("getOnlineUsers", Object.keys(allSocketId));
   

    socket.on("disconnect", () => {
        console.log("User is offline:", socket.id);
        if (allSocketId[userId] === socket.id){
            delete allSocketId[userId];
            io.emit("getOnlineUsers", Object.keys(allSocketId));
        }
    });
});



module.exports= {io, socketServer,app, getReceiverSocketId};