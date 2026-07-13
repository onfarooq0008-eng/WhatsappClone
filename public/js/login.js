const socket = io();

function login(){

const username =
document.getElementById("username").value.trim();

if(username==""){

alert("Enter Username");

return;

}

localStorage.setItem("username",username);

socket.emit("register",username);

socket.on("registered",()=>{

window.location="chat.html";

});

}
