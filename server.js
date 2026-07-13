const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./database");
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


            io.emit(
                "users",
                Object.keys(onlineUsers)
            );


            console.log("Online:", onlineUsers);


        } catch(err){

            console.log(err);

        }

    });



    socket.on("sendMessage",(data)=>{

        console.log("Message:", data);


        db.run(
            `
            INSERT INTO messages
            (sender,receiver,message)
            VALUES(?,?,?)
            `,
            [
                data.sender,
                data.receiver,
                data.message
            ]
        );


        // send to receiver
        let receiverSocket =
        onlineUsers[data.receiver];


        if(receiverSocket){

            io.to(receiverSocket).emit(
                "receiveMessage",
                data
            );

        }


        // send back to sender
        socket.emit(
            "receiveMessage",
            data
        );


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
