const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

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
    console.log("User Connected");
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
