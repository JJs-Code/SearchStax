// version no
const versionNo = '0.0.2';


// default searches
const defaultSearches = {
    Google:       { url: `https://www.google.com/search?q=SEARCHTEXT`,               color: '#0F9D58', state: 'on' },
    Google_Images:{ url: `https://www.google.com/search?tbm=isch&q=SEARCHTEXT`,      color: '#0F9D58', state: 'off'},
    YouTube:      { url: `https://www.youtube.com/results?search_query=SEARCHTEXT`,  color: '#FF0000', state: 'on' },
    Amazon:       { url: `https://www.amazon.com/s?k=SEARCHTEXT`,                    color: '#FF9900', state: 'on' },
    Reddit:       { url: `https://www.google.com/search?q=reddit.com%3A+SEARCHTEXT`, color: '#E84100', state: 'off'},
    Wikipedia:    { url: `https://en.wikipedia.org/wiki/SEARCHTEXT`,                 color: '#000000', state: 'on' }
};


// Menu items
const menuPages = {
    'search'     : 'btn-sch',
    'bookmarks'  : 'btn-bm',
    'background' : 'btn-bg',
    'general'    : 'btn-grl',
    'feedback'   : 'btn-feedback',
    'exts'       : 'btn-apps',
    //'thanks'     : 'btn-thanks'
};


// background images
const backgrounds = [
    "Aurora",
    "Autumm_Leaves",
    "Blossom",
    "Breakwater",
    "Fall",
    "Falls",
    "Frost",
    "Frozen",
    "Haze",
    "Lazy_Day",
    "Morning_Mist",
    "Palm_Beach",
    "Peaks",
    "Sol",
    "Spots",
    "Stripes",
    "Sunset",
    "Treetops",
    "Tropical",
    "Whitewater",
    "Wildflower"
];


// background solid colors
const solidBgIds = {
    'bg-dark' : '#282828',
    'bg-light': '#FFFFFF'
};


// HTML injection: Search Box
function searchHtml(name, key) {
    return `
        <div class="schContBtn actn-btns">

            <svg class="icon btnReorder" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path class="btnReorder" d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>

            <button type="button" class="sch-btn actn-btn btnRed" title="delete">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>         

            <div class="sch-schActv">
                <label class="switch">
                    <input type="checkbox" class="schActv" title="" ${key.state == 'off' ? '' : 'checked'}>
                    <span class="slider round"></span>
                </label>
            </div>

        </div>

        <div class="schColorCont">
            <span>Color: </span>
            <input type="color" class="schColor" title="color" value="${key.color || '#000000'}">
        </div>

        <input type="text" class="schInput schName" title="" placeholder="Name" value="${name != 'blank' ? name : ''}">
        <input type="url"  class="schInput schUrl"  title="" placeholder="Site url" value="${key.url || ''}">
    `
};


// HTML injection: Bookmark Box
function bmHtml(name, key) {
    return `
        <div class="schContBtn actn-btns">

            <svg class="icon bmBtnReorder" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path class="bmBtnReorder" d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>

            <button type="button" class="bm-btn actn-btn btnRed" title="delete">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>         

            <div class="sch-schActv">
                <label class="switch">
                    <input type="checkbox" class="bmActv" title="" ${key.state == 'off' ? '' : 'checked'}>
                    <span class="slider round"></span>
                </label>
            </div>

        </div>

        <input type="text" class="schInput bmName" title="" placeholder="Name" value="${name != 'blank' ? name : ''}">
        <input type="url"  class="schInput bmUrl"  title="" placeholder="Site url" value="${key.url || ''}">
    `
};


//HTML injection: Delete Warning
function deleteWarningHTML() {
    return `
        <div id="delMsgBox">
            <p id="delMsgTitle">Are you sure you want to delete this search?</p>
            <div class="choiceCont">
                <button id="warn-cancel" type="button" class="sch-btn warn-btn btnBlu">Cancel</button>
                <button id="warn-delete" type="button" class="sch-btn warn-btn btnRed">Delete</button>
            </div>
            <p id="daaCont">
                <input type="checkbox" id="daa-cb" value=${delWarn}>
                <label>Dont ask me again</label>
            </p>
        </div>    
    `
};


function resetAllHTML() {
    return `
        <div id="resetAllCont">
            <h3 class="margin0 red"><u>Reset All Settings</u></h3>
            <p id="resetMsgTitle" class="margin0 light-red">This will delete all your current settings and cannot be undone, it is reccommended to back up your searches first, are you sure you want to proceed?</p>
            <div class="choiceCont margin0">
                <button id="reset-cancel" type="button" class="sch-btn warn-btn btnBlu">Cancel</button>
                <button id="reset-delete" type="button" class="sch-btn warn-btn btnRed"><u>RESET ALL</u></button>
            </div>
        </div>    
    `
};
