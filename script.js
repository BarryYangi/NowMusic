const CLOSED_CLASS = "closed";
const islandElement = document.getElementsByClassName("island")[0];

const closeIsland = () => {
  islandElement.classList.add(CLOSED_CLASS);
};

const openIsland = (e) => {
  islandElement.classList.remove(CLOSED_CLASS);
  e && e.stopPropagation();
};

// Initialize event listeners
window.onload = () => {
  islandElement.addEventListener("click", openIsland);
  document.addEventListener("click", closeIsland);
  document.addEventListener(
    "keydown",
    ({ key }) => key?.toLowerCase() === "escape" && closeIsland()
  );
  fetchSongAndPlay();
};

window.onunload = () => {
  islandElement.removeEventListener("click", openIsland);
  document.removeEventListener("click", closeIsland);
  document.removeEventListener("keydown", null);
};

var clock = new Vue({
  el: '#clock',
  data: {
      time: '',
      date: ''
  }
});

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
  var cd = new Date();
  clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
  clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
  var zero = '';
  for(var i = 0; i < digit; i++) {
      zero += '0';
  }
  return (zero + num).slice(-digit);
}

const NETEASE_API_SEARCH = "https://netease-cloud-music-api-tau-sable.vercel.app/cloudsearch?keywords=";
const NETEASE_API_SONG_URL = "https://netease-cloud-music-api-tau-sable.vercel.app/song/url/v1?id=";

let currentAudio = null;
let isPlaying = false;
// 获取当前时间并格式化
function getCurrentFormattedTime() {
  const now = new Date();
  return zeroPadding(now.getHours(), 2) + ':' + zeroPadding(now.getMinutes(), 2);
}

// 更新页面元素
function updatePageElements(songData) {
  document.querySelector(".island h1").textContent = songData.name;
  document.querySelector(".island h2").textContent = songData.ar[0].name;
  document.querySelector(".island .cover img").src = songData.al.picUrl;
}

// 自动播放歌曲
function playSong(songUrl) {
  if (currentAudio) {
    currentAudio.pause();
  }
  currentAudio = new Audio(songUrl);
  currentAudio.play();
  document.getElementById("play").style.display = "none";
  document.getElementById("pause").style.display = "inline";
}

// 请求歌曲信息并更新页面
function fetchSongAndPlay() {
  const currentTime = getCurrentFormattedTime();
  fetch(NETEASE_API_SEARCH + currentTime)
    .then(response => response.json())
    .then(data => {
      if (data.result && data.result.songs.length > 0) {
        const firstSong = data.result.songs[0];
        updatePageElements(firstSong);

        // 请求歌曲 URL 并播放
        fetch(NETEASE_API_SONG_URL + firstSong.id + "&level=standard")
          .then(response => response.json())
          .then(songData => {
            if (songData.data && songData.data.length > 0) {
              playSong(songData.data[0].url);
            }
          });
      }
    });
}


// 播放按钮事件
document.getElementById("play").addEventListener("click", () => {
  fetchSongAndPlay();
});

// 暂停按钮事件
document.getElementById("pause").addEventListener("click", () => {
  if (currentAudio) {
    currentAudio.pause();
    document.getElementById("play").style.display = "inline";
    document.getElementById("pause").style.display = "none";
  }
});

// 下一首按钮事件
document.getElementById("next").addEventListener("click", () => {
  fetchSongAndPlay();
});

// 上一首按钮事件 (关闭页面)
document.getElementById("prev").addEventListener("click", () => {
  // window.close();
});
