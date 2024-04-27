    /*HILIGHT SELECTED OPTION & SAVE TO LOCAL STORAGE*/

function selectActive(classname) {

    // Set active class to selected bg
    var toggle = document.querySelectorAll(classname);
    toggle.forEach(function(el) {
        el.addEventListener('click', function() {
            toggle.forEach(function(elem) {
                elem.classList.remove('active');
            });
            el.classList.add('active');
            localStorage.setItem('currentId', el.id);
            setBgImg(el.id);
        });
    });
  
    // Retrieve stored bg ID and & reactivate the currently active class
    var storedId = localStorage.getItem('currentId');
    var currentId = storedId || '';
    var currentElement = document.getElementById(storedId);
    
    if (currentElement) {
        currentElement.classList.add('active');
    } else {
        document.getElementById('bg-rand').classList.add('active');
    }
}

const storedBackground = localStorage.getItem('selectedBackground');

// Set background image on click & store in localStorage
function setBgImg(background) {
    localStorage.setItem('selectedBackground', background);
    console.log('Stored background = ' + storedBackground);
}


    /*INSERT BACKGROUND IMAGE THUMBNAILS*/

// Dynamically create and append background thumbnails
function createBgThumbs() {
    const bgThumbCont = document.getElementById('bgThumbCont');    
    const imageIndex = backgrounds.reduce((index, background) => {
        index[background] = `https://raw.githubusercontent.com/JJs-Code/SearchStax/main/backgrounds/thumbs/${background}`;
        return index;
    }, {});

    // Create elements to display each image on settings page
    backgrounds.forEach(background => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'bg-thumb';
        thumbnail.style.backgroundImage = `url('https://raw.githubusercontent.com/JJs-Code/SearchStax/main/backgrounds/thumbs/${background}.jpg')`;

        // Add element characteristics
        const filenameText = document.createElement('p');
        filenameText.className = 'img-title';
        thumbnail.id = background;
        const cleanName = background.replace(/_/g, ' ');
        filenameText.textContent = cleanName;
        thumbnail.appendChild(filenameText);
        bgThumbCont.appendChild(thumbnail);
    });
}


    /*SET RANDOM BACKGROUND IMAGE*/

// Sets 

// Event listener for #bg-thumbs-rand
document.getElementById('bg-thumbs-rand').addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="bg-rand-optn"]:checked').id;
    console.log('Stored random setting = ' + selectedOption);

    switch (selectedOption) {

        // Change background once daily
        case 'bg-daily':
            localStorage.setItem('selectedRandOption', 'bg-daily');
            break;

        // Change background every time a new tab is opened
        case 'bg-new-tab':
            localStorage.setItem('selectedRandOption', 'bg-new-tab');
            break;

        // Change background every time the page is refreshed
        case 'bg-refresh':
            localStorage.setItem('selectedRandOption', 'bg-refresh');
            break;
    }
});

// Restores the correct random setting on page refresh
function restoreBgRadio() {
    const selectedId = localStorage.getItem('selectedRandOption');

    if (selectedId) {
        const selectedRadio = document.getElementById(selectedId);

        if (selectedRadio) {
            selectedRadio.checked = true;
        } else {
            console.log('Radio element not found.');
        }
    }
}

// Calls all functions
createBgThumbs();
restoreBgRadio();
selectActive ('.bg-thumb');


