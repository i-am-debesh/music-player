const playBtnElement = document.querySelector('.play');
const forwardBtnElement = document.querySelector('.forward-btn-js');
const backwardBtnElement = document.querySelector('.backward-btn-js');
const progressBarElement = document.getElementById('js-progress-area');
const progressd = document.getElementById('js-progress');
const currentTimeElement = document.querySelector('.js-current-time');
const durationElement = document.querySelector('.js-duration');
const musicNameElement = document.querySelector('.js-music-name');
const loopStatus = document.querySelector('.loop-status');
const loopImage = document.querySelector('.loop-img');
const loopElement = document.querySelector('.looping');
const playListElement = document.querySelector('.play-list');
const itemsElement = document.querySelector('.items');
let playlist = [];
let fileName;
let fileIndex= 0;
let music;
let isPlaying = false;
let opening = true;
let looping = false;
let isPaused = false;
function handleFileSelect(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        playlist.push({ name: file.name, url: url });
        appendToPlaylist(file.name, i);
        
    }
    

}
document.getElementById('fileInput').addEventListener('change', handleFileSelect);
let listShowing = false;
playListElement.addEventListener('click', ()=>{
    if(listShowing === false) {
        itemsElement.classList.add('show-list');
        listShowing=true;
    }else {
        itemsElement.classList.remove('show-list');
        listShowing=false;
    }
    
})

function appendToPlaylist(fileName, idx) {
    const itemField = document.querySelector('.items');
    // const listElement = document.getElementById('list');
    // const listItem = document.createElement('div');
    const listItem = `
    <div class="music-file">
        
        <div class="file-name file-idx-${idx}" id=${idx} onclick=playThis()>
            <div>${idx+1}.&nbsp;&nbsp;</div>
            <div>${fileName}</div>
        <div>
    </div>
    `;
    itemField.innerHTML += listItem;
    
}

///
function updateFileName(fileIndex) {
    fileName = playlist[fileIndex].url;
    music = new Audio(fileName);
    musicNameElement.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="2">${playlist[fileIndex].name}</marquee`;
    
    const fileId = document.getElementById(`${fileIndex}`);
    // fileId.style.backgroundColor = 'green'
    fileId.classList.add("playing");
    
}

const playBtn = document.querySelector('.play');
playBtn.addEventListener('click',()=>{
    try {
        playMusic();
    } catch (error) {
        alert('add music files to play');
    }
    
    handleRotation();
    

});
backwardBtnElement.addEventListener('click', ()=>{
    playPrevious();
});
forwardBtnElement.addEventListener('click',()=>{
    playNext();
});

function playPrevious() {
    const fileId = document.getElementById(fileIndex);
    fileId.classList.remove('playing');
    if(fileIndex === 0) {
        fileIndex = playlist.length-1;
    }else{
        fileIndex --;
    }

    stopMusic();
    updateFileName(fileIndex);
    playMusic();
}
function playNext() {    
    const fileId = document.getElementById(fileIndex);
    fileId.classList.remove("playing");
    if(fileIndex === playlist.length-1) {
        fileIndex = 0;
    }else {
        if(looping === false) {
            fileIndex++;
        }
        
    }
    
    stopMusic();
    updateFileName(fileIndex);
    playMusic();
    
}

function playMusic(fileIndex=0) {

    if(opening === true) {
        
        updateFileName(fileIndex);
        music.play();
        opening=false;
        music.onended = playNext;
        updateProgressBar();
        
        playBtnElement.innerHTML = `<img src="icons/play.png" alt="" class="pause-image control-icon">`;

    }
    if(isPlaying === false) {
        updateProgressBar();
        music.play();
        isPlaying = true;
        music.onended = playNext;
        playBtnElement.innerHTML = `<img src="icons/pause.png" alt="" class="pause-image control-icon">`;

    
    }else if(isPlaying === true) {
        stopMusic();
        isPlaying = false;
        playBtnElement.innerHTML = `<img src="icons/play.png" alt="" class="play-image control-icon">`;

    }
}
function stopMusic() {
    if(isPlaying) {
        music.pause();
        isPlaying = false;
    }
    
    
}
//progressBar::
let currMinTime = 0;
let currSecTime = 0;
let minTime = 0;
let secTime  = 0;
function updateProgressBar() {
    
    music.ontimeupdate = ()=>{
        durationElement.innerHTML = `${Number(minTime)}:${Number(secTime)}`;
        let progress = ((music.currentTime/music.duration)*100).toFixed(2);
        progressd.style.width = `${progress}%`;
        //for current time:
        currMinTime = Math.floor(music.currentTime/60);
        currSecTime = Math.floor((music.currentTime.toFixed(2))%60);
        if(currMinTime < 10 ) {
            currMinTime = '0'+currMinTime;
        }
        if(currSecTime <10) {
            currSecTime = '0'+currSecTime;
        }
        currentTimeElement.innerHTML = `${currMinTime}:${currSecTime}`;

        //for duration:
        minTime = Number(Math.floor(music.duration/60));
        secTime = Number(Math.floor((music.duration.toFixed(2))%60));
        // currentTimeElement.innerHTML = Math.floor(progress);
        //durationElement.innerHTML = `${minTime}:${secTime}`;
    };

}

progressBarElement.onclick = (e)=>{
    music.currentTime = ((e.offsetX/progressBarElement.offsetWidth)*music.duration);
}


//loop functionality:::
const loopON = ()=> {
    looping = true;
    loopStatus.innerText = 'on';
}
const loopOFF = ()=> {
    looping = false;
    loopStatus.innerText = 'off';
}
loopOFF();

loopElement.addEventListener('click',(event)=> {
    event.preventDefault();
    if(looping) {
        loopOFF();
    }else if(!looping) {
        loopON();
    }
})


//rotation control::::::::::::
function handleRotation (){
    const posterRotationElement = document.querySelector('.poster');
    if(isPlaying === true) {
        posterRotationElement.classList.add('rotation');

    }else if(isPlaying === false) {
        posterRotationElement.classList.remove('rotation');
    }
}
