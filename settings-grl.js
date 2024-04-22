//blur slider
const slider  = document.getElementById('blurSlider');
const output  = document.getElementById('blurValue');
const blurImg = document.getElementById('blurImg');
let blurSetpoint = localStorage.getItem('blurIntensity');
let blurIntensity = blurSetpoint ? blurSetpoint : 4;
blurImg.style.filter = `blur(${blurIntensity}px)`;
slider.value = blurIntensity * 12.5;
output.textContent = `Setpoint: ${blurIntensity * 12.5}%`;

slider.addEventListener("input", function() {
    output.textContent = `Setpoint: ${this.value}%`;
    let adjustedOutput = this.value / 12.5;
    localStorage.setItem('blurIntensity', adjustedOutput);
    blurImg.style.filter = `blur(${adjustedOutput}px)`;
})

// on/off listener
let stgListener = {}; //for preventing activation of event listener more than once
function stgOnOff(setting) {
    const toggle = document.getElementById(setting);
    let value = JSON.parse(localStorage.getItem(setting)) || {};

    if (value === 'off') {
        toggle.removeAttribute('checked');
        toggle.checked = false;
    } else {
        toggle.setAttribute('checked', '');
        toggle.checked = true;
    }
    
    if(stgListener[setting] != 'on') {
        stgListener[setting] = 'on';
        toggle.addEventListener('change', function() {
            console.log('toggled ' + setting);

            let toggleCheck = toggle.hasAttribute('checked');
            if (toggleCheck) {
                toggle.removeAttribute('checked');
                toggle.checked = false;
            } else {
                toggle.setAttribute('checked', '');
                toggle.checked = true;
            }
            toggleCheck = toggle.hasAttribute('checked');
            value = toggleCheck ? 'on' : 'off';
            localStorage.setItem(setting, JSON.stringify(value));
        });
    }
}

function stgOnOffAll() {
    stgOnOff('delWarn');
    stgOnOff('googleAnim');
    stgOnOff('borderColors');
    stgOnOff('showLogo');
    stgOnOff('swapBookmarks');
}

/*
//import/export
const IEField = document.getElementById('import-export');
const importSave = document.getElementById('btn-importSave');
let searchData = localStorage.getItem('schData');
IEField.value = searchData;
importSave.addEventListener('click', function() {
    searchData = IEField.value;
    localStorage.setItem('schData', searchData);
    location.reload();
});
*/

//import/export
const IEField = document.getElementById('import-export');
const importSave = document.getElementById('btn-importSave');
let searchData = localStorage.getItem('schData') || {};
let bookmarkData = localStorage.getItem('bmData') || {};
const concData = `${searchData}|${bookmarkData}`;
IEField.value = concData;
importSave.addEventListener('click', function() {
    const [newSchData, newBmData] = IEField.value.split('|');
    localStorage.setItem('schData', newSchData);
    localStorage.setItem('bmData', newBmData);
    location.reload();
});


//reset all settings
const resetAllBtn = document.getElementById('btn-reset');
resetAllBtn.addEventListener('click', function() {
    document.getElementById('stgGrlCont').insertAdjacentHTML('beforeend', resetAllHTML());
    const resetAllCont   = document.getElementById('resetAllCont');
    const resetAllDelete = document.getElementById('reset-delete');
    const resetAllCancel = document.getElementById('reset-cancel');
    resetAllDelete.addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    })
    resetAllCancel.addEventListener('click', function() {
        resetAllCont.remove();
    })
});
