const socket = io();


let username =
localStorage.getItem("username");


if(!username){

window.location="/";

}


document.getElementById("myUser").innerHTML=username;


socket.emit("register",username);



socket.on("users",(users)=>{


let box=document.getElementById("users");


box.innerHTML="";


users.forEach(user=>{


if(user==username)
return;



box.innerHTML += `

<div class="user"
onclick="openChat('${user}')">


<div class="avatar">

${user[0].toUpperCase()}

</div>


<div>

<h3>${user}</h3>

<div class="online">
● Online
</div>

</div>


</div>

`;

});


});



function openChat(user){

localStorage.setItem("chatUser",user);

window.location="message.html";

}
