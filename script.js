let musicList = {
    1 : "one.mp3",
    2 : "Apocalypse  Cigarettes After Sex_320kbps.mp3",
    3 : "yt1s.com - Dhoro Jodi Hothat Sondhye  ধর যদ হঠৎ সনধয  বউনডল  Baundule  Spandan Bengali Song.mp3",
    4 : "Shey Ki Jane Lofi Remix-(Mr-Jat.in).mp3",
    5 : "Raatan Lambiyan.mp3"

}

let index = 1;
let fileName = musicList[index];
let music = new Audio(`musics/${fileName}`);
let isPlaying = false;
const playBtnElement = document.querySelector('.play');
const forwardBtnElement = document.querySelector('.forward-btn-js');
const backwardBtnElement = document.querySelector('.backward-btn-js');
const progressBarElement = document.getElementById('js-progress-area');
const progressd = document.getElementById('js-progress');
const currentTimeElement = document.querySelector('.js-current-time');
const durationElement = document.querySelector('.js-duration');
const musicNameElement = document.querySelector('.js-music-name');

playBtnElement.addEventListener('click', ()=>{
    if(!isPlaying) {
        isPlaying = true;
        updateProgressBar();
        music.play();
        musicNameElement.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="2">${musicList[index]}</marquee`;
        
        playBtnElement.innerHTML = `<img src="icons/pause.png" alt="" class="pause-image control-icon"></img>`;
    }else if(isPlaying) {
        isPlaying = false;
        pauseMusic();
        playBtnElement.innerHTML = `<img src="icons/play.png" alt="" class="play-image control-icon">`;
    }

}); 

forwardBtnElement.addEventListener('click',()=>{
    pauseMusic();
    
    if(index != 5) {
        index++;
        updateMusic();
    }else if(index === 5) {
        index = 1;
        updateMusic();
    }
    if(isPlaying) {
        playBtnElement.innerHTML = `<img src="icons/pause.png" alt="" class="pause-image control-icon"></img>`;
    }

});

backwardBtnElement.addEventListener('click',()=>{
    pauseMusic();
    if(index > 1) {
        index--;
        updateMusic();
    }else if(index === 1) {
        index = 5;
        updateMusic();
    }
});




// const clickTone = new Audio('tones/click.mp3');

function updateMusic() {
    let fileName = musicList[index];
    music = new Audio(`musics/${fileName}`);
    updateProgressBar();
    musicNameElement.innerHTML = musicList[index];
    musicNameElement.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="2">${musicList[index]}</marquee`;

    music.play();
    isPlaying = true;
    music.onended  = playNext;
}
function pauseMusic() {
    music.pause();
}
function playNext() {
    if(index <5) {
        index++;
    }else{
        index = 1;
    }
    
    music.onended = playNext;
}

function updateProgressBar() {
    music.ontimeupdate = ()=>{
        let progress = ((music.currentTime/music.duration)*100).toFixed(2);
        progressd.style.width = progress+"%";
        //for current time:
        let currMinTime = Math.floor(music.currentTime/60);
        let currSecTime = Math.floor((music.currentTime.toFixed(2))%60);
        if(currMinTime < 10 ) {
            currMinTime = '0'+currMinTime;
        }
        if(currSecTime <10) {
            currSecTime = '0'+currSecTime;
        }
        currentTimeElement.innerHTML = `${currMinTime}:${currSecTime}`;

        //for duration:
        let minTime = Math.floor(music.duration/60);
        let secTime = Math.floor((music.duration.toFixed(2))%60);
        // currentTimeElement.innerHTML = Math.floor(progress);
        durationElement.innerHTML = `${minTime}:${secTime}`
    };

}

progressBarElement.onclick = (e)=>{
    music.currentTime = ((e.offsetX/progressBarElement.offsetWidth)*music.duration);
}


// music.play();

