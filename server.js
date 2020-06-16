// init 
const express = require("express");
const path = require("path");
const app = express();
// const net = require("net");
const request = require("request");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// Static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});
app.get("/ufo", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/ufo.html'));
});
app.get("/patterson", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/patterson.html'));
});
app.get("/soutar", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/soutar.html'));
});


io.on('connection', socket => {
  socket.on('new message', data => {
    console.log('Server broadcasting: ' + data);
    socket.broadcast.emit('new message', data);
  });
  socket.on('patterson', data => {
    console.log('Command recieved: ' + data);
    socket.broadcast.emit('patterson', data);
  });
  socket.on('word', data => {
    console.log('words recieved: ' + data);
    socket.broadcast.emit('word', data);
  });
});

server.listen(port, () => {
  console.log('Server listening at port: ' + port);
});

