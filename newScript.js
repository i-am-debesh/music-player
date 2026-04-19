if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered!'))
      .catch(err => console.error('Service Worker failed:', err));
  });
}
// window.addEventListener('beforeunload', (event) => {
//     // Cancel the event (standard practice)
//     event.preventDefault();
    
//     // Chrome requires returnValue to be set
//     event.returnValue = ''; 
// });
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
        
        saveSongToDB(file);
        appendToPlaylist(file.name, playlist.length-1)
        
    } 

}
// function updateIndex() {

// }
function renderList(list) {
    itemsElement.innerHTML = '';
    let i = 0;
    list.forEach(item=>{
        appendToPlaylist(item.name, i++);
    })
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
            
            <div style="cursor: pointer;" class="file-name file-idx-${idx}" id=${idx} onclick=playThis(this.id)>
                
                <div>${idx+1}.&nbsp;&nbsp;</div>
                
                <div class="scrolling-container">
                    <div class="scrolling-text">${fileName}</div>
                </div>

                <div class="wave-container">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>

                
            </div>

           
            <div class="rm-area">
                <button class="rm-btn" onclick="deleteFromApp('${fileName}', this)">
                    <img src="icons/list.png" alt="remove" class="rm-icon">
                </button>
            </div>
            
        </div>
    `;
    itemField.innerHTML += listItem;
    
}
function playThis(musicId) {
    
    opening = false;
    fileIndex = Number(musicId);
    updateFileName(Number(musicId));
    playMusic();    
    handleRotation();
    
    
}

///
function updateFileName(fileIndex) {
    document.querySelectorAll('.playing').forEach(el => el.classList.remove('playing'));
    if(isPlaying === true) {
        stopMusic();
    }
    fileName = playlist[fileIndex].url;
    music = new Audio(fileName);
    musicNameElement.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="2">${playlist[fileIndex].name}</marquee`;
    
    const fileId = document.getElementById(`${fileIndex}`);
    // fileId.style.backgroundColor = 'green'
    fileId.classList.add("playing");
    
    updateLockScreen(playlist[fileIndex].name,'unknown')
    
}
function updateLockScreen(title, artist) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist
    });
  }
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
    handleRotation();
});
forwardBtnElement.addEventListener('click',()=>{
    playNext();
    handleRotation();
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

// for lock screen actions::::

if ('mediaSession' in navigator) { 
    const iconPath = window.location.origin + '/icons/your-image-name.png';

    let title = '';
    if(playlist.length > 0 ) {
        title = playlist[fileIndex].name;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
    title: title,
    artist: 'unknown',
    album: 'My PWA Collection',
    artwork: [
      { src: iconPath, sizes: '512x512', type: 'image/png' }
    ]
  });

  // Action for the 'Back' button on lock screen
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    playPrevious(); // Call your existing function here
  });

  // Action for the 'Forward' button on lock screen
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    playNext() // Call your existing function here
  });

  // Action for Play/Pause
  navigator.mediaSession.setActionHandler('play', () => {
    music.play();
    isPlaying = true;
    isPaused = false;
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    music.pause();
    isPlaying = false;
    isPaused = true;
  });
};




////// DB

let db;
// 1. Open the database
const request = indexedDB.open("MusicPlayerDB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", { keyPath: "name" });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    console.log("Database Connected");
    loadAllSongs(); // 2. Automatically load saved songs when the app opens
};

function saveSongToDB(file) {
    const transaction = db.transaction(["songs"], "readwrite");
    const store = transaction.objectStore("songs");
    store.put({ name: file.name, data: file});
}

function loadAllSongs() {
    const transaction = db.transaction(["songs"], "readonly");
    
    
    const store = transaction.objectStore("songs");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const savedSongs = getAllRequest.result;
        // let i=fileIndex;
        playlist=[];
        //itemsElement.innerHTML = '';
        savedSongs.forEach(song => {
            const blob = song.data;
            //const url = URL.createObjectURL(song);
            //console.log(song);
            const newUrl = URL.createObjectURL(blob);
            playlist.push({name: song.name, url: newUrl});

            const songToPlay = {
            name: song.name,
            url: newUrl
        };

            renderList(playlist); 
        });    
    };
}

/// DELETE SONG FROM DB AND RERENDER::::

function deleteFromApp(songName, btnElement) {
    // 1. Find the parent container to remove it from UI later
    const musicFileDiv = btnElement.closest('.music-file');
    const musicName = btnElement.closest('.file-name');
    console.log(musicName);
    
    // if(musicName.classList.contains('playing')){
    //     stopMusic();
    // }
    // 2. Open IndexedDB transaction
    const transaction = db.transaction(["songs"], "readwrite");
    const store = transaction.objectStore("songs");

    // 3. Delete from Database
    const request = store.delete(songName);

    request.onsuccess = () => {
        console.log(`${songName} removed from storage.`);
        
        // 4. Smooth UI Removal
        musicFileDiv.style.transition = "0.3s";
        musicFileDiv.style.opacity = "0";
        musicFileDiv.style.transform = "translateX(20px)";
        
        setTimeout(() => {
            musicFileDiv.remove();
            
            location.reload();
           
        }, 300);
    };

    request.onerror = () => {
        console.error("Failed to delete song from IndexedDB");
    };
}