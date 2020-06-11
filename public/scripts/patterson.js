'use strict';

const socket = io();

// audio set up
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
let gainNode = audioCtx.createGain();
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
analyser.maxDecibels = -10;

// visual set up
const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext("2d");

// Speech Recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// TO DO: ADD GRAMMAR LIST HERE TO RECOGNISE ALT COMMANDS

const a = ['time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand', 'part', 'child', 'eye', 'patterson',
    'woman', 'place', 'work', 'week', 'case', 'point', 'number', 'group', 'problem', 'fact', 'be', 'paterson', 'antwerp',
    'have', 'do', 'say', 'get', 'make', 'go', 'know', 'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use', 'find',
    'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little',
    'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few',
    'public', 'bad', 'same', 'able', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 
    'after', 'the', 'and', 'a', 'that', 'i', 'it', 'not', 'he', 'as', 'you', 'this', 'but', 'his', 'they', 'her', 'she', 'or',
    'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', ' ', 'how', 'why', 'where', '', 'what', 'are', 'was']

const recognition = new SpeechRecognition();
let recognising = false;
let resultArray = []; // array of recognition results
let wordArray = []; // array of individual words in each result
const wordSet = new Set(); // set of unique words per session
let newWords = ' ';

const commonWords = new Set();// set of 100+ commonly used words

let confidenceScore = 0;
let newWordScore = 0;
let baseScore = 0;
let finalScore = 0;
let totalScore = 0;

const command = '0';
let commands = [];
commands.push(command);

let audio = document.querySelector("audio");

document.addEventListener("DOMContentLoaded", () => {
    init();
    
});

// perform functions when keys pressed (32 = spacerbar)
document.body.onkeyup = (e) => {
    if(e.keyCode == 32) {
      if(audio.canPlayType("audio/mpeg")) {
        audio.type = "audio/mpeg";
        audio.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2Fbeep1.mp3?v=1584109042342";
      }
      spacePress();
    }
    else if(e.keyCode == 38) {
      if(audio.canPlayType("audio/mpeg")) {
        audio.type = "audio/mpeg";
        audio.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FdeeDum.mp3?v=1584109067168";
      }
      upPress();
    }
    else if(e.keyCode == 40) {
      if(audio.canPlayType("audio/mpeg")) {
        audio.type = "audio/mpeg";
        audio.src = "https://cdn.glitch.com/8199502f-e529-4aa4-ba55-e8b0a29c18a5%2FdoubleBeep.mp3?v=1584109073783";
      }
      downPress();
    }
}

// recognition settings
recognition.continuous = true;
recognition.maxAlternatives = 1;
recognition.interimResults = false;
recognition.lang = 'en-gb';

// what happens after each recognition
recognition.onresult = (event) => {
    console.log('----Speech Regnition Results----')
    for(let i = event.resultIndex; i < event.results.length; i++) {
            let r = event.results[i];
            resultArray.push(r);
            console.log(r);
            // console.log(r[r.length -1].transcript)
            wordArray = resultArray[i][0].transcript.split(" ");
            for(let i = 0; i < wordArray.length; i++) {
                wordArray[i] = wordArray[i].toLowerCase();
            }
    }
    console.log('-------New Words-------');
    for(let i =0; i < wordArray.length; i++) {
        if(!commonWords.has(wordArray[i]) && !wordSet.has(wordArray[i])){
            let newWord = wordArray[i];
            wordSet.add(newWord);
            newWords += '. ' + newWord;
            console.log('+1 ' + newWord);
            newWordScore++;
        }
    }
}

// what happens after recognition.stop()
recognition.onend = () => {
    calculateScore()
    logResults();
    try{
       socket.emit('word', newWords);
    }catch(err) {
      console.log(err.name + ': ' + err.message);
    }finally{
      try{
        socket.emit('new message', finalScore);
      }catch(err) {
        console.log(err.name + ': ' + err.message);
      }finally{
        try{
          socket.emit('patterson', 'clean');
        }catch(err) {
          console.log(err.name + ': ' + err.message);
        }
      }
    }
    reset(); 
}

recognition.onerror = (_error) => {
    console.log('ERROR: ' + event.error);
}

//-------FUNCTIONS/METHODS--------//

 async function spacePress() {
    try {
      await audio.play()
    }catch(err) {
      console.log(err.name + ': ' + err.message);
    }finally {
      recognise();
    }
  }

async function upPress() {
  try {
    await audio.play();
  }catch(err) {
    console.log(err.name + ': ' + err.message);
  }finally {
    location.reload();
  }
}

async function downPress() {
  try {
    await audio.play();
  }catch(err) {
    console.log(err.name + ': ' + err.message);
  }finally {
    socket.emit('patterson', 'clean');
  }
}

function reset() {
    resultArray = [];
    wordArray = [];
    recognising = false;
    confidenceScore = 0;
    newWordScore = 0;
    baseScore = 0;
    finalScore = 0;
    newWords = ' ';
}

function recognise() {
    if(recognising) {
        recognition.stop();
        audioCtx.suspend();
    }else {
        audioCtx.resume();
        grabAudio();
        drawAudio();
        recognition.start();
        recognising = true;
    }
   
}

function calculateScore() {
    // add together confidence scores
    for(let i = 0; i < resultArray.length; i++) {
        confidenceScore += resultArray[i][0].confidence;
    }
    // divide by number of recognitions
    if (wordArray.length > 0) {
        confidenceScore /= resultArray.length;
    // multiply avg confidence score to give base score
    baseScore = Math.round(confidenceScore * 10);
    finalScore = baseScore + newWordScore;
    totalScore += finalScore;
    }
} 

function grabAudio() {
    console.log('-------Audio Stream------')
    if(navigator.mediaDevices) {
        console.log('getUserMedia supported');
        window.navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(function(stream) {
            console.log(stream); 
            let source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        })
        .catch(function(err) {
            console.log(err.name + " : " + err.message);
        });
    }else {
        console.log('getUserMedia not supported');
    }
}

function drawAudio() {
    requestAnimationFrame(drawAudio);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = 'yellow';
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';

    canvasCtx.beginPath();

    let sliceWidth = width * 1.0/bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * height / 2;
        if(i=== 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x,y);
        x += sliceWidth;
    }
    canvasCtx.stroke();
}

function drawLine() {
    let height = canvas.height = window.innerHeight;
    let width = canvas.width = window.innerWidth;
    let y = height/2;
    canvasCtx.lineWidth = 4;
    canvasCtx.strokeStyle = 'yellow';
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, y);
    canvasCtx.lineTo(width ,y);
    canvasCtx.stroke();
}

function logResults() {
    console.log('--------Transcript--------')
    for(let i = 0; i < resultArray.length; i++) {
        console.log(resultArray[i][0].transcript);
    }
    console.log('--------New Words Set------')
    console.log(wordSet);
    console.log('----------Scores----------');
    console.log('Avg Confidence Score: ' + confidenceScore + '\n'
    + 'Base Score: ' + baseScore + '\n'
    + 'New Word Score: ' + newWordScore + '\n'
    + 'Final Score: ' + finalScore + '\n'
    + 'Total Score: ' + totalScore); 
}


function init() {
    for(let i = 0; i < a.length; i++) {
        commonWords.add(a[i]);
    }
    console.log('------Common Words------');
    console.log(commonWords);
    drawLine();
}
