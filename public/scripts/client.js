'use strict'

document.addEventListener("DOMContentLoaded", () => {
  localStorage.act = 0;
  localStorage.ufoEnergy = 10;
});

document.body.onkeyup = (e) => {
  if(e.keyCode == 32) {
    location.assign('https://transgalatic-library-adventure.glitch.me/ufo');
  }
}

const socket = io();

function sendCommand(data) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    console.log(httpRequest.readystate);
  }
  if(data == 'clean'){
    httpRequest.open('GET', 'http://192.168.0.150/roomba.cgi?button=CLEAN', true);
  }
  if(data == 'spot'){
    httpRequest.open('GET', 'http://192.168.0.150/roomba.cgi?button=SPOT', true);
  }
  httpRequest.send();
}

socket.on('patterson', data => {
  console.log('Command recieved: ' + data);
  sendCommand(data);
})



