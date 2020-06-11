'use strict'

const music = document.getElementById("music");
const title = document.getElementById("title");
const stars = document.getElementById("stars");
const wait = document.getElementById("wait");
const curtainContainer = document.getElementById("curtainContainer");
const socket = io();

let curtain;

document.addEventListener("DOMContentLoaded", () => {
  if(localStorage.act == 5) {
    makeCurtain('100%');
    wait.style.opacity = 0;
    title.style.opacity = 1;
    stars.style.opacity = 1;
    setTimeout(titleFadeOut, 25000);
    setTimeout(fadeOutStars, 3000);
    music.play();
    music.addEventListener('ended', _=> {
      document.getElementById('fin').innerHTML = "Thanks everyone!";
      waitFadeIn();
      setTimeout(finishAmin, 5000);
    });
    localStorage.act = 0;
  }else {
    makeCurtain('0%');
    localStorage.act = 0;
    localStorage.wordEnergy = 10;
    localStorage.words = '';
    waitFadeIn();
  }
});

document.body.onkeyup = (e) => {
  if(e.keyCode == 32) {
    waitFadeOut();
    animTitle();
    setTimeout(fadeInStars, 5000);
    music.play();
    music.addEventListener('ended', _=> {
      setTimeout(_=> {
        location.assign('https://transgalatic-library-adventure.glitch.me/ufo');
      }, 2000);
      
    });
  }else if(e.keyCode == 67) {
    curtainUp();
  }else if(e.keyCode == 68) {
    curtainDown();
  }
}

const makeCurtain = margin => {
  curtain = document.createElement('img');
  curtain.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FcurtainsTrans.png?v=1589830409802";
  curtain.style.width = "100%";
  curtain.style.height = '100%';
  curtain.style.position = "absolute";
  curtain.style.zIndex = "100";
  curtain.style.bottom = margin;
  curtain.style.opacity = 1;
  curtainContainer.appendChild(curtain);
}

const curtainUp = _=> {
  curtain.animate([{bottom:'0%'}, {bottom:'100%'}], {duration:5000, itertations:1})
  .onfinish = _=> {
    curtain.style.opacity = 0;
  }
}

const curtainDown = _=> {
  curtain.style.opacity = 1;
  curtain.animate([{bottom:'100%'}, {bottom:'0%'}], {duration:2000, iterations:1})
  .onfinish = _=> {
    curtain.style.bottom = '0%';
  }
  
}

const titleFadeOut = _=> {
  title.animate([{opacity:1}, {opacity:0}], {duration:5000, iterations:1})
  .onfinish = _=> {
    title.style.opacity = 0;
  }
}

const waitFadeIn = _=> {
  wait.animate([{opacity:0}, {opacity:1}], {duration:2000, iterations:1})
  .onfinish = _=> {
     wait.style.opacity = 1;
  }
}

const waitFadeOut = _=> {
  wait.animate([{opacity:1}, {opacity:0}], {duration:2000, ioterations:1})
  .onfinish = _=> {
    wait.style.opacity = 0;
  }
}

const animTitle = _=> {
  title.animate([{opacity:0}, {opacity:1}], {duration:18000, iterations:1})
  .onfinish = _=> {
    title.style.opacity = 1;
  };
  title.animate([{top: '100%', transform: 'translate(-50%, -0%)'}, {top: '50%', transform: 'translate(-50%, -50%)'}], {duration:28000, iterations:1})
   .onfinish = _=> {
    titleFadeOut();
  };
}

const finishAmin = _=> {
  waitFadeOut();
  setTimeout(makerLogoIn, 2500);
}

const makerLogoIn = _=> {
   document.getElementById('fin').remove();
        title.remove();
        let makerSpace = document.createElement("img");
        makerSpace.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FScreenshot%202020-04-29%20at%2013.32.30.png?v=1590503677362";
        makerSpace.style.position = 'fixed';
        makerSpace.style.width = '800px';
        makerSpace.style.top = '50%';
        makerSpace.style.left = '50%';
        makerSpace.style.transform = 'translate(-50%, -50%)';
        makerSpace.style.zIndex = 50;
        wait.appendChild(makerSpace);
        wait.style.opacity = 1;
}

       

const fadeInStars = _=> {
  stars.animate([{opacity:0}, {opacity:1}], {duration:27000, iterations:1})
  .onfinish = _=> {
    stars.style.opacity = 1;
  }
}

const fadeOutStars = _=> {
  stars.animate([{opacity:1}, {opacity:0}], {duration:15000, iterations:1})
  .onfinish = _=> {
    stars.style.opacity = 0;
  }
}

// const sendCommand = data => {
//   const httpRequest = new XMLHttpRequest();
//   httpRequest.onreadystatechange = () => {
//     console.log(httpRequest.readystate);
//   }
//   if(data == 'clean'){
//     httpRequest.open('GET', 'http://192.168.1.144/roomba.cgi?button=CLEAN', true);
//     console.log('clean command sent')
//   }
//   if(data == 'spot'){
//     httpRequest.open('GET', 'http://192.168.1.144/roomba.cgi?button=SPOT', true);
//   }
//   httpRequest.send();
// }

const sendCommand = data => {
  let xhr = new XMLHttpRequest();
  if(data == 'clean'){
    try{
      xhr.open('GET', 'http://192.168.1.144/roomba.cgi?button=CLEAN', true);
      xhr.onload = request => {
        let response = request.currentTarget.response || request.target.reponseText;
        console.log("RooWiFi response: " + response);
        };
    }catch(err) {
      console.log(err.name + ': ' + err.message);
    }finally{
      xhr.send();
    }
  }
}

socket.on('patterson', data => {
  console.log('Command recieved: ' + data);
  sendCommand(data);
})



