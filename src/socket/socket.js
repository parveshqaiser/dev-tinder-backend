
// socket server is top layer of express server
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const socketServer = http.createServer(app);

const io = new Server(socketServer, { 
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"]
});


let allSocketId = {};

const getReceiverSocketId = (id)=>{
    return allSocketId[id]
}

io.on("connection", (socket) => {
    console.log("User connected with socket id :", socket.id);

    let userId = socket.handshake.query.userId;

    // who ever is coming online store here 
    if (userId) {
        allSocketId[userId] = socket.id;
    }

    // sending back end data to front end
    io.emit("getOnlineUsers", Object.keys(allSocketId));

    socket.on("disconnect", () => {
        console.log("User is offline:", socket.id);
        delete allSocketId[userId];
        io.emit("getOnlineUsers", Object.keys(allSocketId));
    });
});

module.exports = {io,socketServer, app, getReceiverSocketId};


/*
What Socket.IO is
Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.

*/
