var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Route for static files
app.use(express.static(__dirname + '/public/'));
//Route to handle diff request
app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//socket
var userData = [];
io.on('connection', function(socket){
  console.log('User connected');
  // console.log(socket);
  socket.on('disconnect', function(){
    index = userData.indexOf(socket.username);
    if(index > -1){
      userData.splice(index,1);
    }
    console.log(socket.username+' disconnected');
    socket.broadcast.emit('endUser',{name:socket.username,usersOnline:userData.length-1});
  });

  socket.on('chat message', function(msg){
    console.log(socket);
    // console.log('message: ' + msg);
    io.emit('chat message', {name:socket.username,data:msg});
  });

  socket.on('addUser', function(user){
    console.log(user);
    socket.username = user;
    userData.push(user);
    // console.log(socket.username);
    socket.broadcast.emit('userAdded',{name:socket.username,usersOnline:userData.length-1});
  });

  socket.on('typing', function(data){
    socket.broadcast.emit('typing',{name:socket.username});
  });

  socket.on('stop typing', function(data){
    socket.broadcast.emit('stop typing',{name:socket.username});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
