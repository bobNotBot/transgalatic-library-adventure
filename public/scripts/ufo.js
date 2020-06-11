'use strict'

const socket = io();

let earth = document.getElementById("png-earth");
let ufo = document.getElementById("png-ufo");
let energyBar = document.getElementById("energyContainer");
let energy = 0;
// let energyLevel = 0;
let maxEnergy = 500;
let energyPercent = '0%';
let energyFill = document.getElementById("energyFill");
let baseWidth = '0%';
let ufoExit = false;
let speaking = false;
let soutarVoice = document.getElementById("soutarVoice");
let odyssey = document.getElementById("odyssey");

const energyInterval = window.setInterval('fillEnergyBar();', 5000);

const synth = window.speechSynthesis;

document.addEventListener("DOMContentLoaded", () => {
  soutarVoice.loop = false;
  fillEnergyBar(); 
  if (localStorage.act >= 1){
    showHideAll('visible');
    sayEnergy();
  }
});

document.body.onkeyup = (e) => {
    if(e.keyCode == 32) {
        if(odyssey.canPlayType("audio/mpeg")){
          odyssey.type = "audio/mpeg";
          odyssey.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2F2001.mp3?v=1584736837854";
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
  localStorage.wordEnergy = parseInt(localStorage.wordEnergy) + data;
  speaking = true;
});

socket.on('word', data => {
  // localStorage.words = '';
  localStorage.words = data;
  console.log(localStorage.words);
  });
  

const speechSynth = word => {
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    synth.speak(utter);
}

const showEnergy = _=> {
    energyBar.style.visibility = 'visible';
    if(soutarVoice.canPlayType("audio/mpeg")){
      soutarVoice.type = "audio/mpeg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2Fwarning.mp3?v=1584712858014"
    }
    soutarVoice.loop = true;
    soutarVoice.play();
    let assign = _=> {
      location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
    }
    setTimeout(assign, 8000);
}

const sayEnergy = _=> {
    if(soutarVoice.canPlayType("audio/mpeg")) {
      soutarVoice.type = "audio/mpeg";
      soutarVoice.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FenergyLevelAt.mp3?v=1584712879183";
    }
    soutarVoice.play();
    soutarVoice.addEventListener('ended', _=> {
      const utter =  new SpeechSynthesisUtterance(energyPercent);
      synth.cancel();
      synth.speak(utter);
      energyCheck();
    });
}

const speakWord =  _=> {
  const utter = new SpeechSynthesisUtterance('New words recognised' + localStorage.words);
  utter.onend = _=> {
    setTimeout(sayEnergy, 1000);
  }
  synth.cancel();
  synth.speak(utter);
  // localStorage.words = '';
}

const ufoIN = _=> {
  const ufoINAnim = ufo.animate([{marginLeft: '100%', height: '0px'}, {marginLeft: '0%', height: '240px'}], {duration: 80000, iterations: 1});
  ufo.style.visibility = 'visible';
  ufoINAnim.play();
}

const earthIN = _=> {
  const earthINAnim = earth.animate([{marginLeft: '100%', marginTop: '100%'}, {marginLeft: '0%', marginTop: '0%'}], {duration: 60000, iterations: 1});
  earth.style.visibility = 'visible';
  earthINAnim.play();
}


const earthOUT = _=> {
  const earthOUTAnim = earth.animate([{marginLeft: '0%', marginTop: '0%'}, {marginLeft: '100%', marginTop: '100%'}], {duration:5000, iterations:1});
  earthOUTAnim.onfinish = _=> {
    earth.style.visibility = 'hidden';
  }
  earthOUTAnim.play();
}

const energyBarFadeOut = _=> {
  const energyBarAnim = energyBar.animate([{opacity:1}, {opacity:0}], {duration:2000, iterations:1});
  energyBarAnim.onfinish = _=> {
    energyBar.style.opacity = 0;
    location.assign("https://transgalatic-library-adventure.glitch.me");
  }
  energyBarAnim.play();
}

const ufoOUT = _=> {
  const ufoAnim = ufo.animate([{marginRight: '0%', height: '240px'}, {marginRight: '100%', height: '0px'}], {duration: 2000, iterations: 1});
  ufoAnim.onfinish = _=> {
    console.log('finished')
    ufo.style.visibility = 'hidden';
    energyBarFadeOut();
  }
  ufoAnim.play();
}

const exit = _=> {
  ufoOUT();
  earthOUT();
}

const fillEnergyBar = _=> {

  localStorage.energyLevel = Math.round((localStorage.wordEnergy/maxEnergy)*100);
  
  let energyLevel = localStorage.energyLevel; 

  if(energyLevel < 0)(energyLevel = 0);
  if(energyLevel > 100)(energyLevel = 100);

  let energyColour;
  if(energyLevel >= 90){
      energyColour = 'lime';
  }else if(energyLevel >= 75 && energyLevel < 90){
      energyColour = 'green';
  }else if(energyLevel < 75 && energyLevel >=50){
      energyColour = 'yellow';
  }else if(energyLevel <50 && energyLevel > 10){
      energyColour = 'orange';
  }else if(energyLevel <= 10){
      energyColour = 'red';
      energyFill.animation = "flash linear 1s infinite";
  }

  energyFill.style.backgroundColor = energyColour;
  
  energyPercent = energyLevel + '%';

  energyFill.animate([{width: baseWidth}, {width: energyPercent}], {duration: 2000});
  
  energyFill.style.width = energyPercent;
  baseWidth = energyPercent;
  
  if(speaking){
    speakWord();
    speaking = false;
  }
  
  adventureLog();
}

const energyCheck = _=> {
  const energyLevel = localStorage.energyLevel;
  
  if(energyLevel >= 10 && energyLevel < 50 && localStorage.act == 1) { 
    setTimeout(goSoutar, 2000);
  }
  else if(energyLevel >= 50 && energyLevel < 75 && localStorage.act == 2) {
   setTimeout(goSoutar, 2000);
  }
  else if(energyLevel >= 75 && energyLevel < 90 && localStorage.act == 3) {
    setTimeout(goSoutar, 2000);
  }
  else if(energyLevel >= 90 && energyLevel < 100 && localStorage.act == 4) {
    setTimeout(goSoutar, 2000);
  }
  else if (energyLevel >= 100 && localStorage.act == 5) {
    if(odyssey.canPlayType("audio/mpeg")){
      odyssey.type = "audio/mpeg";
      odyssey.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FspaceshipAway.mp3?v=1587676805362";
    }
    setTimeout(_=> {
      odyssey.play();
    }, 10000);
    setTimeout(exit, 15500);
    clearInterval(energyInterval);
  }
}

const goSoutar = _=> {
  location.assign("https://transgalatic-library-adventure.glitch.me/soutar");
}

const adventureLog = _=> {
    console.log('Total Score: ' + energy 
    + '\n----------------\nEnergy Level: ' + energyPercent);
}

const showHideAll = e => {
    earth.style.visibility = e;
    ufo.style.visibility = e;
    energyBar.style.visibility = e;
}
