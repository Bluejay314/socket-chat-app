const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
    console.log("new user connected");

    socket.broadcast.emit("connection", "new user connected");
    socket.emit("new connection", "welcome!");

    socket.on('chat message', (msg, user) => {
        console.log(`user: ${user}, message: ${msg}`);
        socket.broadcast.emit('chat message', msg, "received", user);
        socket.emit('chat message', msg, "sent", user);
    });

    socket.on("typing", (user, isTyping) => {
        socket.broadcast.emit("typing", user, isTyping);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit("disconnection", "a user disconnected");
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
