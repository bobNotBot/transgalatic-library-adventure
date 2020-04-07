'use strict'

const socket = io();

let earth = document.getElementById("png-earth");
let ufo = document.getElementById("png-ufo");
let energyBar = document.getElementById("energyContainer");
let energy = 0;
let energyLevel = 0;
let maxEnergy = 1000;
let energyPercent = '0%';
let energyFill = document.getElementById("energyFill");
let baseWidth = '0%';
let ufoExit = false;
let speak = false;
let soutarVoice = document.getElementById("soutarVoice");
let odyssey = document.getElementById("odyssey");

const energyInterval = window.setInterval('fillEnergyBar();', 5000);

const synth = window.speechSynthesis;

document.addEventListener("DOMContentLoaded", () => {
  soutarVoice.loop = false;
  fillEnergyBar();
  if(localStorage.act == 0) {
    showHideAll('hidden');
  }else if (localStorage.act >= 1){
    speak = true;
    sayEnergy();
  }
});

document.body.onkeyup = (e) => {
    if(e.keyCode == 32) {
        if(odyssey.canPlayType("audio/mpeg")){
          odyssey.type = "audio/mpeg";
          odyssey.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2F2001.mp3?v=1584736837854";
        }else {
          odyssey.type = "audio/ogg";
          odyssey.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2F2001.ogg?v=1584736865550";
        }
        odyssey.play();
        ufoIN();
        earthIN();
        odyssey.addEventListener('ended', () => {
          showEnergy();
        });
    } 
}

socket.on('new message', data => {
  speak = true;
  localStorage.ufoEnergy = data;
  socket.emit('patterson', 'spot');
});

function speechSynth(word) {
    const utter = new SpeechSynthesisUtterance(word);
    synth.speak(utter);
}

function showEnergy() {
    energyBar.style.visibility = 'visible';
    if(soutarVoice.canPlayType("audio/mpeg")){
      soutarVoice.type = "audio/mpeg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2Fwarning.mp3?v=1584712858014"
    }else {
      soutarVoice.type = "audio/ogg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2Fwarning.ogg?v=1584712866778"
    }
    soutarVoice.loop = true;
    soutarVoice.play();
    localStorage.act = 1;
    let assign = () => {
      location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
    }
    setTimeout(assign, 8000);
}

function sayEnergy() {
  if(speak) {
      if(soutarVoice.canPlayType("audio/mpeg")) {
      soutarVoice.type = "audio/mpeg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FenergyLevelAt.mp3?v=1584712879183";
    }else {
      soutarVoice.type = "audio/ogg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FenergyLevelAt.ogg?v=1584712891221";
    }
    soutarVoice.play();
    soutarVoice.addEventListener('ended', () => {
       speechSynth(energyPercent);
    });
    speak = false;
  }else {
    return;
  }
}

function ufoIN() {
    ufo.style.visibility = 'visible';
    ufo.animate([{marginLeft: '100%', height: '0px'}, {marginLeft: '0%', height: '240px'}], {duration: 80000, iterations: 1});
}

function earthIN() {
    earth.style.visibility = 'visible';
    earth.animate([{marginLeft: '100%', marginTop: '100%'}, {marginLeft: '0%', marginTop: '0%'}], {duration: 60000, iterations: 1});
}

function ufoOUT() {
  ufo.animate([{marginRight: '0%', height: '240px'}, {marginRight: '100%', height: '0px'}], {duration: 2000, iterations: 1});
  setTimeout(exit, 1900);
  function exit() {
    ufo.style.visibility = 'hidden';
  }
}

function fillEnergyBar() {

  energy = localStorage.ufoEnergy;

  let energyLevel = Math.round((energy/maxEnergy)*100);

  if(energyLevel < 0)(energyLevel = 0);
  if(energyLevel > 100)(energyLevel = 100);

  let energyColour;
  if(energyLevel >= 90){
      energyColour = 'lime';
  }else if(energyLevel >= 75 && energyLevel < 90){
      energyColour = 'green';
  }else if(energyLevel < 75 && energyLevel >=50){
      energyColour = 'yellow';
  }else if(energyLevel <50 && energyLevel > 25){
      energyColour = 'orange';
  }else if(energyLevel <= 25){
      energyColour = 'red';
      energyFill.animation = "flash linear 1s infinite";
  }

  energyFill.style.backgroundColor = energyColour;
  
  energyPercent = energyLevel + '%';

  energyFill.animate([{width: baseWidth}, {width: energyPercent}], {duration: 2000});

  energyFill.style.width = energyPercent;
  baseWidth = energyPercent;
  adventureLog();
  sayEnergy();
  
  if(energyLevel >= 25 && energyLevel < 50 && localStorage.act == 1) { 
    location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
    localStorage.act = 2; 
  }
  else if(energyLevel >= 50 && energyLevel < 75 && localStorage.act == 2) {
   location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
   localStorage.act = 3;
  }
  else if(energyLevel >= 75 && energyLevel < 90 && localStorage.act == 3) {
    location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
    localStorage.act = 4;
  }
  else if(energyLevel >= 90 && energyLevel < 100 && localStorage.act == 4) {
    location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
    localStorage.act = 5;
  }
  else if (energyLevel >= 100 && localStorage.act == 5) {
    setTimeout(ufoOUT, 5000);
    clearInterval(energyInterval);
  }
}

function adventureLog() {
    console.log('Total Score: ' + energy 
    + '\n----------------\nEnergy Level: ' + energyPercent);
}

function showHideAll(e) {
    earth.style.visibility = e;
    ufo.style.visibility = e;
    energyBar.style.visibility = e;
}
