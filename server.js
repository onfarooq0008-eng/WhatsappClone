const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const auth = require("./auth");

require("./database");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/health", (req, res) => {
    res.send("OK");
});

io.on("connection", (socket) => {

    socket.on("register", async (username) => {

        try {

            const user = await auth.createUser(username);

            socket.username = username;

            socket.emit("registered", user);

            console.log(username + " joined");

        } catch (err) {

            console.log(err);

        }

    });

});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
