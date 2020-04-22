'use strict'

const music = document.getElementById("music");
const title = document.getElementById("title");
const stars = document.getElementById("stars");
const wait = document.getElementById("wait");
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  localStorage.act = 0;
  localStorage.ufoEnergy = 10;
});

document.body.onkeyup = (e) => {
  if(e.keyCode == 32) {
    wait.style.display = 'none';
    animTitle();
    setTimeout(animStars, 5000);
    music.play();
    music.addEventListener('ended', _=> {
      location.assign('https://transgalatic-library-adventure.glitch.me/ufo');
    });
  }
}

function animTitle() {
  title.animate([{opacity:0, top: '100%', transform: 'translate(-50%, -0%)'}, {opacity:1, top: '50%', transform: 'translate(-50%, -50%)'}], {duration:28000, iterations:1});
  title.style.opacity = 1;
}

function animStars() {
  stars.animate([{opacity:0}, {opacity:1}], {duration:27000, iterations:1});
  stars.style.opacity = 1;
}

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



