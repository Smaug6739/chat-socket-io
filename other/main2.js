const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http);

io.on("connection", () =>{
    console.log("a user is connected")
   })
   
const dbUrl = "mongodb://localhost:27017/instantchat";
const mongOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds //5000
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity  //45000
    family: 4 // Use IPv4, skip trying IPv6
  }

mongoose.connect(dbUrl, mongOptions , (err) => { 
    console.log("mongodb connected",err);
 })

 var Message = mongoose.model("Message",{ name : String, message : String})



var server = app.listen(3000, () => {
    console.log("server is running on port", server.address().port);
   });

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })

  app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })

  