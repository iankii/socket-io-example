const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

var cors = require('cors');

var loki = require('lokijs');

var db = new loki('loki.json');
var loggers = db.addCollection('loggers')

const port = 9999;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

const saveData = (data) => {
  console.log('saving data into LOKI js.');
  loggers.insert(data)
};

io.on('connection', socket => {
  console.log('user connected');

  socket.on('change data', (data) => {
    console.log(`color changed to ${data}`);
    io.sockets.emit('change data', data);
    saveData(data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

server.listen(port, () => console.log(`server is running on port: ${port}`));