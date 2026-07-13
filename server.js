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

let onlineUsers = {};

io.on("connection", (socket) => {


    socket.on("register", async (username) => {

        try {

            const user = await auth.createUser(username);

            socket.username = username;


            onlineUsers[username] = socket.id;


            socket.emit("registered", user);


            // send users list to everyone
            io.emit(
                "users",
                Object.keys(onlineUsers)
            );


            console.log(username + " joined");


        } catch(err){

            console.log(err);

        }

    });



    socket.on("disconnect",()=>{

        if(socket.username){

            delete onlineUsers[socket.username];


            io.emit(
                "users",
                Object.keys(onlineUsers)
            );

        }

    });


});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

const db = require("./database");


io.on("connection",(socket)=>{


socket.on("joinChat",(username)=>{

socket.username=username;

});



socket.on("sendMessage",(data)=>{


const {sender,receiver,message}=data;



db.run(

`INSERT INTO messages
(sender,receiver,message)
VALUES(?,?,?)`,

[sender,receiver,message]

);



io.to(onlineUsers[receiver])
.emit("receiveMessage",data);



});



});
