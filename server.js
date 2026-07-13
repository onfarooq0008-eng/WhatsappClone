const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const db = require("./database");
const auth = require("./auth");

const app = express();

const server = http.createServer(app);

const io = new Server(server);


const PORT = process.env.PORT || 3000;


app.use(express.static("public"));


let onlineUsers = {};



io.on("connection", (socket)=>{


    console.log("Socket connected:", socket.id);



    socket.on("register", async(username)=>{


        try{


            const user = await auth.createUser(username);


            socket.username = username;


            onlineUsers[username] = socket.id;



            socket.emit("registered", user);



            io.emit(
                "users",
                Object.keys(onlineUsers)
            );



            console.log(username,"online");



        }catch(error){

            console.log(error);

        }


    });




    socket.on("sendMessage",(data)=>{


        console.log("Message received:",data);



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



        const receiverSocket =
        onlineUsers[data.receiver];



        if(receiverSocket){


            io.to(receiverSocket)
            .emit(
                "receiveMessage",
                data
            );


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


        console.log("Disconnected");


    });



});




server.listen(PORT,()=>{


console.log(
"Server running on port "+PORT
);


});
