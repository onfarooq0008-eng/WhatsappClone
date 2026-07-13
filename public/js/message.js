const socket=io();


let me=localStorage.getItem("username");

let friend=localStorage.getItem("chatUser");


document.getElementById("friend").innerHTML=friend;



socket.emit("joinChat",me);



function send(){


let input=document.getElementById("text");


let msg=input.value;


if(msg=="") return;



socket.emit("sendMessage",{

sender:me,

receiver:friend,

message:msg

});


show(msg);



input.value="";


}



function show(msg){


document.getElementById("messages").innerHTML +=

`
<div class="msg">
${msg}
</div>
`;

}



socket.on("receiveMessage",(data)=>{


if(data.sender==friend){

show(data.message);

}


});
