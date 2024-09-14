// Vars
const bgImgElement = document.getElementById('bgImg');
const headerBar = document.getElementById('headerBar');
const storedBackground = localStorage.getItem('selectedBackground') || 'bg-rand';
console.log ('Stored background = ' + storedBackground);
const dailyBackground = localStorage.getItem('dailyBackground');
const solidBg = solidBgIds[storedBackground];
const randSetting = localStorage.getItem('selectedRandOption');
const sessionBackground = sessionStorage.getItem('sessionBackground');
let lastBackgroundChangeDate = '';

function setBackground(source) {
    bgImgElement.style.backgroundImage = `url('https://raw.githubusercontent.com/JJs-Code/SearchStax/main/backgrounds/${source}.jpg')`;
}


/*LOAD UPDATED BACKGROUND*/

document.addEventListener('DOMContentLoaded', function() {
    let styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    
    if (!storedBackground || storedBackground == 'bg-rand') {
        console.log('checking random background setting');
        bgBehaviour(randSetting);
    } else if (solidBg) {
        if (solidBg.includes('#')) {
            bgImgElement.style.backgroundColor = solidBg;
            console.log(solidBg);
            bgImgElement.style.backgroundImage = 'none';
            headerBar.style.background = 'none';
            styleElement.innerHTML += 
            '\n' + 'input { filter: drop-shadow(0 0 0 #FFFFFF) !important; border: 1px solid #dfe1e5 !important; }' +
            '\n' + 'img { filter: none !important; }' +
            '\n' + 'p, span { text-shadow: none !important; }';
        }
    } else {
        setBackground(storedBackground);
    }
    
    if (solidBg) {
        if (solidBg.includes('#FFFFFF')) {
            styleElement.innerHTML += 
            '\n' + 'p, span { color: #282828 !important; font-weight: 600;}' + 
            '\n' + 'path {fill: var(--dark2) !important; }' + 
            '\n' + 'svg { filter: drop-shadow(0 0 0 #FFFFFF) !important; }';
        }
    }

    preloadImages(backgrounds);
});

// Preload & cache all background images
function preloadImages(images) {
    images.forEach(image => {
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/JJs-Code/SearchStax/main/backgrounds/${image}.jpg`;
    });
    console.log('all images cached');
}


    /*SET RANDOM BACKGROUND IMAGE*/

// Function to chose when to change background
function bgBehaviour(stg) {
    switch (stg) {

        // Change background once daily
        case 'bg-daily':
        case null:
            console.log('rand setting = bg-daily');
            if (bgDaily()) {
                getRandomBackground();
            } else if (dailyBackground) {
                setBackground(dailyBackground);
            } else {
                getRandomBackground();
            } break;

        // Change background every time a new tab is opened
        case 'bg-new-tab':
            console.log('rand setting = bg-new-tab');
            if (sessionBackground) {
                console.log(`Session background = ${sessionBackground}`);
                setBackground(sessionBackground);
            } else {
                console.log('No stored session background');
                getRandomBackground();
            } break;

        // Change background every time the page is refreshed
        case 'bg-refresh':
            console.log('rand setting = bg-refresh');
            getRandomBackground();
            break;
    }
};

// Function to select a random background from the array
function getRandomBackground() {
    console.log('fetching random background');
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const randomBg = backgrounds[randomIndex];
    console.log('index = ' + randomIndex + ', background = ' + randomBg);
    localStorage.setItem('dailyBackground', randomBg);
    sessionStorage.setItem('sessionBackground', randomBg);
    setBackground(randomBg);
}

// Create short date from Date()
function shortDate(date) {
    if (date) {
        let monthNotation = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        let year  = date.getFullYear();
        let month = monthNotation[date.getMonth()];
        let day   = date.getDate();
        let hour  = date.getHours();
        return `${day}/${month}/${year}  ${hour}:00`;
    } else {
        return 'no date stored'
    }
}

// Function for daily background change
function bgDaily() {

    let storedDate = localStorage.getItem('dateChange');
    let currentDate = new Date();
    let targetHour = 3;
    let targetAMPM = 'am';
    let targetDate = new Date();
    if (currentDate.getHours() < targetHour) {
        targetDate.setDate(targetDate.getDate() - 1);
    };  targetDate.setHours(3,0,0,0);

    let lastChangeDate = storedDate ? new Date(storedDate) : 'no date stored';
    let timeSinceTargetHour = (currentDate - targetDate) / (60 * 60 * 1000);
    let timeSinceLastChange = (currentDate - lastChangeDate) / (1000 * 60 * 60);
    let updateDue = timeSinceLastChange > timeSinceTargetHour;

    function hourFormat (num) {
        return num.toFixed(2).toString().padStart(5, '0');
    }

    if (storedDate) {
        console.log(`Background set to change once daily at ${targetHour + targetAMPM}`);
        console.log(`Current date:            ${shortDate(currentDate)}`);
        console.log(`Target date:             ${shortDate(targetDate)}`);
        console.log('Stored date:             ' + shortDate(lastChangeDate));
        console.log(`Time since ${targetHour + targetAMPM}:          ${hourFormat(timeSinceTargetHour)} hrs`);
        console.log(`Time since last change:  ${hourFormat(timeSinceLastChange)} hrs`);
        console.log(`Update due?              ${updateDue}`);
    } else {
        console.log(`Stored date of last background change: none`);
        updateDue = true;
    }

    if (updateDue || updateDue == null) {
        localStorage.setItem('dateChange', currentDate.toISOString());
        let updatedDate = new Date(localStorage.getItem('dateChange'));
        console.log(`Background set to change`)
        console.log(`updating last date change = ${shortDate(updatedDate)}`);
        return true;
    } else {        
        console.log(`Background set not to change`);
        console.log ('Daily background = ' + dailyBackground);
        return false;
    }
}


