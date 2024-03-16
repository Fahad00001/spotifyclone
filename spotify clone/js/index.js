console.log("hello");
let currentsong = new Audio();
function secondsToMinutesSeconds(seconds) {
  // Ensure seconds is a non-negative number
  if (typeof seconds !== "number" || seconds < 0) {
    return "Invalid input";
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the result as mm:ss
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const result = secondsToMinutesSeconds(12); // Output: '00:12'
console.log(result);

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playmusic = (track, pause = false) => {
  // let audio=new Audio("/songs/" + track)
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00";
};
async function main() {
  // let currentsong;
  // get all the songs list
  let songs = await getsongs();
  playmusic(songs[0], true);
  console.log(songs);
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="" />
    <div class="info">
      <div> ${song.replaceAll("%20", " ")}</div>
      <div>fahad</div></div>
    </div>
    <div class="playnow">
      <span>play now</span>
      <img class="invert" src="play.svg" alt="" />
    </div>
</li>`;
  }
  // attach an event listner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  // attach an event listner to play next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
  });
//   add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%"
    currentsong.currentTime=((currentsong.duration)*percent)/100
})

}
main();
