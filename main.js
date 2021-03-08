const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const morgan = require('morgan')("dev");

const server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});


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
const dbUrl = "mongodb://localhost:27017/instantchat";
const Message = mongoose.model('Message',{
    name : String,
    message : String
  })
mongoose.connect(dbUrl ,mongOptions ,(err) => {
    console.log('mongodb connected',err);
})
  

app.use(express.static(__dirname +"/front-end"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan)


app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err) {
        sendStatus(500);
        return console.log("error")
    }
    io.emit('message', req.body);
    res.sendStatus(200);
    /*try{
       return res.redirect('http://localhost:3000');

    }catch(err){
        console.log(err)
    }*/
  })
})

io.on('connection', () =>{
  console.log('A user is connected')
})
app.get('*', function(req, res){
  res.send('Page not found', 404);
});