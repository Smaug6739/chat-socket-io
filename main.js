const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan')("dev");
const db = require('./util/db')

const server = http.listen(3000, () => {
  console.log('Server started on port', server.address().port);
});




app.use(express.static(__dirname + "/front-end"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(morgan)


app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages LIMIT 200', (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send('An error has occurred.')
    }
    console.log(result)
    res.send(result);
  })
})


app.post('/messages', (req, res) => {
  if (!req.body.name || req.body.name && req.body.name.trim() === '') return res.status(400).send('Missing name value in body.')
  if (!req.body.message || req.body.message && req.body.message.trim() === '') return res.status(400).send('Missing message value in body.')
  db.query('INSERT INTO messages (name, message) VALUES (?, ?)', [req.body.name, req.body.message], (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send('An error has occurred.')
    }
    io.emit('message', req.body);
    const responce = {
      name: req.body.name,
      message: req.body.message
    }
    console.log(responce)
    res.status(201).send(responce);
  })
})

io.on('connection', () => {
  console.log('A user is connected')
})
app.get('*', function (req, res) {
  res.send('Page not found', 404);
});