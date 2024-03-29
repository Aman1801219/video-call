const express=require("express");
const https=require("https");
const app=express();
const server = require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidv4}=require("uuid");
const {ExpressPeerServer}=require('peer');
const peerServer= ExpressPeerServer(server,{
  debug:true
});

app.use(express.static('public'));

app.set('view engine','ejs');
app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room',(req,res)=>{
  res.render('room',{roomId: req.params.room});
})

app.post('/:room',(req,res)=>{
  res.render('room',{roomId: req.params.room});
})

io.on('connection',socket=>{
  socket.on('join-room',(roomId,userId)=>{
  socket.join(roomId);
  socket.to(roomId).broadcast.emit('user-connected', userId);
  console.log(userId);

  socket.on('message',message=>{
    io.to(roomId).emit('createMessage',message)
  })
  })
})


//Server setup
server.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
