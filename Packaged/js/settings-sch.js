// vars
const schArea         = document.getElementById('schDataCont');
let firstChild        = schArea.querySelector('div.schCont');
let draggables        = document.querySelectorAll('.schCont');
let storedData        = JSON.parse(localStorage.getItem('schData'));
let deleteBtns        = document.querySelectorAll('.sch-btn[title="delete"]'); 
let delWarnLs         = JSON.parse(localStorage.getItem('delWarn'));
let delWarn           = delWarnLs ? delWarnLs : 'on';
let warningMsg        = document.getElementById('warningMsg');
let nameMsg           = document.getElementById('nameMsg');
let urlMsg            = document.getElementById('urlMsg');
let uniqueNameMsg     = document.getElementById('uniqueNameMsg');
let savedMsg          = document.getElementById('savedMsg');
let daaListener       = 0;
let deleteListeners   = 0;
let draggedIndicator  = 0;
let dragListeners     = 0;


// initialise
initialise();


// functions

function updateAll() {
    update1stChild();
    updateDraggables();
    updateStoredData();
    updateDeleteBtns();
    updateDeleteWarn();
    updateWarningMsgs();
    detectDelete();
    stgOnOffAll();
    runListeners();
    //console.log('updated all')
};

function update1stChild()    {firstChild    = schArea.querySelector('div.schCont');}
function updateDraggables()  {draggables    = document.querySelectorAll('.schCont');}
function updateStoredData()  {storedData    = JSON.parse(localStorage.getItem('schData'));}
function updateDeleteBtns()  {deleteBtns    = document.querySelectorAll('.sch-btn[title="delete"]');}
function updateDeleteWarn()  {delWarnLs     = JSON.parse(localStorage.getItem('delWarn'));
                              delWarn       = delWarnLs ? delWarnLs : 'on';}
function updateWarningMsgs() {warningMsg    = document.getElementById('warningMsg');
                              nameMsg       = document.getElementById('nameMsg');
                              urlMsg        = document.getElementById('urlMsg');
                              uniqueNameMsg = document.getElementById('uniqueNameMsg');
                              savedMsg      = document.getElementById('savedMsg');}

function runListeners() {
    detectDelete();
    schOnOff();
    dragAndDrop();
}

function initialise() {
    if (!storedData) {
        const defaultSearchesStringified = JSON.stringify(defaultSearches).replace('Google_Images', 'Google Images');
        localStorage.setItem('schData', defaultSearchesStringified);
    }
    updateStoredData();
    addSchConts(storedData);
    updateAll();
}

function addSchConts(obj) {
    var entries = Object.entries(obj).reverse();
    entries.forEach(([name, key]) => {
        var newSchCont = document.createElement('div');
        newSchCont.className = 'schCont';
        newSchCont.id = name != 'blank' ? name.replace(/\s+/g, '_') : 'newSch';
        newSchCont.innerHTML = searchHtml(name, key);
        update1stChild();
        if (firstChild) {
            schArea.insertBefore(newSchCont, firstChild);
        } else {
            schArea.appendChild(newSchCont);
        }
        adjustSchWidth();
    });
}

function saveCheck() {
    //console.log('saveCheck initiated');
    let i = 0;
    let {badName, badUrl} = badSyntax();

    if (!dataEntered()) {
        showWarningMsg();
        i++;
    } else {removeMsgs(warningMsg)}

    if (badName) {
        showNameMsg();
        i++;
    } else {removeMsgs(nameMsg)}

    if (badUrl) {
        showUrlMsg();
        i++;
    } else {removeMsgs(urlMsg)}

    if (uniqueName()) {
        showUniqueNameMsg();
        i++;
    } else {removeMsgs(uniqueNameMsg)}
    
    if (i == 0) {
        showSavedMsg();
    } else {removeMsgs(savedMsg)}

    updateAll();
}

function dataEntered() {
    updateAll();

    if (!firstChild) {
        return true;
    }

    let nameInput = firstChild.querySelector('.schName');
    let urlInput = firstChild.querySelector('.schUrl');
    let calc = nameInput.value.trim() && urlInput.value.trim();
    return calc;
}

function badSyntax() {
    let badName = false;
    let badUrl = false;
    document.querySelectorAll('.schName').forEach(input => {
        if (/[^a-zA-Z0-9\s]/.test(input.value)) badName = true;
    });
    document.querySelectorAll('.schUrl').forEach(url => {
        if ((!url.value.includes("SEARCHTEXT") || url.value.substring(0,4) != 'http') && url.value != '') {
            badUrl = true;
        }
    });
    return { badName, badUrl };
}

function uniqueName() {
    const inputs = document.querySelectorAll('.schName');
    const values = [];
    let duplicate = false;
    inputs.forEach(input => {
        const value = input.value.trim();
        if (values.includes(value)) {
            duplicate = true;
        } else {
            values.push(value);
        }
    });
    return duplicate;
}

function removeMsgs(msgElem) {
    updateWarningMsgs();
    if (msgElem) {
        msgElem.remove();
    }
}

function showMessage(msgId, msgClass, flashClass, msgContent) {
    updateWarningMsgs();
    let msgElem = window[msgId];
    if (!msgElem) {
        update1stChild();
        msgElem = document.createElement('p');
        msgElem.id = msgId;
        msgElem.classList.add('schMsg', msgClass);
        msgElem.innerHTML = msgContent;
        schArea.insertBefore(msgElem, firstChild);
    } else {
        msgElem.classList.add(flashClass);
        setTimeout(() => {
            msgElem.classList.remove(flashClass);
        }, 500); 
    }
}

function showWarningMsg() {
    showMessage(
        'warningMsg',
        undefined,
        'warningFlash',
        'Fill in all input fields before saving or adding new searches'
    );
}

function showNameMsg() {
    showMessage(
        'nameMsg', 
        'syntaxMsg', 
        'syntaxFlash',
        "Only letters, numbers, and spaces are allowed in the 'Name' field"
    );
}

function showUrlMsg() {
    showMessage(
        'urlMsg', 
        'syntaxMsg', 
        'syntaxFlash',
        "The 'URL' field must contain the phrase \"SEARCHTEXT\" and include the 'https://' prefix"
    );
}

function showUniqueNameMsg() {
    showMessage(
        'uniqueNameMsg', 
        'syntaxMsg', 
        'syntaxFlash',
        'New name cannot be the same as already existing search name'
    );
}

function showSavedMsg() {
    //console.log('show saveMsg initiated');
    saveSearch();
    updateDeleteBtns();
    updateWarningMsgs();
    showMessage(
        'savedMsg', 
        undefined, 
        'savedFlash',
        'Saved!'
    );
}


function saveSearch() {
    //console.log('saveSearch initiated');
    const schData = {};
    let schContElement = '';

    //const newSch = document.getElementById('newSch');
    const nameInputs = document.querySelectorAll('.schName');

    if (nameInputs.length === 0) {
        localStorage.setItem('schData', JSON.stringify({}));
        storedData = {};
        return;
    }

    nameInputs.forEach(function (nameInput) {
        schContElement = nameInput.closest('.schCont');
        let nameValue = nameInput.value;
        schContElement.id = nameValue.replace(/\s+/g, '_');
        schData[nameValue] = {};

        function inputs(className, prop) {
            const input = schContElement.querySelector(`.${className}`);
            let inputValue = '';
            if (prop == 'state') {
                inputValue = input.checked == true ? 'on' : 'off';
            } else {
                inputValue = input.value;
            }
            schData[nameValue][prop] = inputValue;
            //console.log('saving search for ' + className + '\tin ' + nameValue);
        }

        inputs('schUrl',   'url');
        inputs('schColor', 'color');
        inputs('schActv',  'state');
        updateAll();
        //location.reload();
    })

    localStorage.setItem('schData', JSON.stringify(schData));
    storedData = JSON.parse(localStorage.getItem('schData'));
    updateAll();
};


function insertDeleteWarning(click) {
    const delMsgBox = document.getElementById('delMsgBox');
    if (!delMsgBox) {
        document.getElementById('search').insertAdjacentHTML("beforeend", deleteWarningHTML());
        let checkbox = document.getElementById('daa-cb');
        let checkboxClickArea = document.getElementById('daaText');
        updateDeleteWarn();
        
        checkboxClickArea.addEventListener('click', toggleCheckbox);

        function toggleCheckbox() {
            if (checkbox.checked) {
                checkbox.checked = false;
                delWarn = 'on';
            } else {
                checkbox.checked = true;
                delWarn = 'off';
            }
            console.log('delWarn = ' + delWarn);
            updateDaaLocalStorage();
        }
    
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                delWarn = 'off';
            } else {
                delWarn = 'on';
            };
            updateDaaLocalStorage();
        });
            
        function updateDaaLocalStorage() {
            localStorage.setItem('delWarn', JSON.stringify(delWarn));
            updateDeleteWarn();
            //console.log(`Delete confirmation set to ${delWarn}`);
            //console.log(document.getElementById('delWarn'));
        }

        function removeDeleteWarningDialogue() {
            checkboxClickArea.removeEventListener('click', toggleCheckbox);
            document.getElementById('delMsgBox').remove();
        }

        document.getElementById('warn-cancel').addEventListener('click', function() {
            removeDeleteWarningDialogue();
        })
        document.getElementById('warn-delete').addEventListener('click', function() {
            removeDeleteWarningDialogue();
            deleteSch(click);
        })
    }
}

function deleteSch(click) {
    //console.log('delete clicked');
    click.preventDefault();
    let schContElement = click.target.closest('.schCont');
    console.log(schContElement.id + ' Deleted');
    let nameId = schContElement.id.replace(/_/g, ' ');
    schContElement.remove();
    updateStoredData();
    delete storedData[nameId];
    saveCheck();
    localStorage.setItem('delWarn', JSON.stringify(delWarn));
    updateAll();
}


function toggleSearch() {
    let toggle = this;
    let schContElement = toggle.closest('.schCont');
    let nameId = schContElement.id.replace(/_/g, ' ');
    let toggleCheck = toggle.hasAttribute('checked');
    if (toggleCheck) {
        schContElement.classList.add('inactive');
        toggle.removeAttribute('checked');
    } else {
        schContElement.classList.remove('inactive');
        toggle.setAttribute('checked', '');
    }
    toggleCheck = toggle.hasAttribute('checked');
    storedData[nameId]['state'] = toggleCheck ? 'on' : 'off';
    localStorage.setItem('schData', JSON.stringify(storedData));
}


function removeDrag() {
    var schConts = document.querySelectorAll('[draggable="true"]');
    schConts.forEach(function(schCont) {
        schCont.removeAttribute('draggable');
    });
}

function getDragAfterElement(schArea, y) {
    const draggableElements = [...schArea.querySelectorAll('.schCont:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        } 
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function adjustSchWidth() {
    updateAll();
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    function setWidth(className, width, maxWidth, flexWrap) {
        document.querySelectorAll(className).forEach(elem => {
            elem.style.width = width;
            elem.style.maxWidth = maxWidth;
            elem.style.flexWrap = flexWrap;
        })        
    }
    if (viewportWidth >= 1500) {
        //sets widths to make schCont appear on one line
        setWidth('.schCont', '100%', '1450px', 'nowrap');
        setWidth('.schName', 'calc(100% / 2.5)', '300px', '');
        setWidth('.schUrl', '100%', '100%', '');
    } else {
        //returns widths back to original when window shrinks
        const classArray = ['.schCont', '.schName', '.schUrl'];
        classArray.forEach(className => {
            setWidth(className, '', '', '');
        }) 

    }
}

// LISTENERS

// add new
document.getElementById('addNewSch').addEventListener('click', function(click) {
    click.preventDefault();
    removeMsgs(savedMsg);
    if (dataEntered()) {
        //console.log('adding new search field');
        let blankObj = {blank: ''};
        addSchConts(blankObj);
        updateAll();
    } else showWarningMsg();
});


// save
document.getElementById('schSave').addEventListener('click', function(click) {
    click.preventDefault();
    saveCheck();
});


// delete
function removeDeleteListeners() {
    if (deleteListeners === 1) {
        deleteBtns.forEach(function(deleteButton) {
            deleteButton.removeEventListener('click', deleteHandler);
        })
        deleteListeners = 0;
    }
};

function deleteHandler(click) {
    updateDeleteWarn();
    if (delWarn != 'off') {
        insertDeleteWarning(click);
    } else {
        deleteSch(click);
        //console.log('delete detected');
    }
}

function detectDelete() {
    removeDeleteListeners();
    updateDeleteBtns();

    if (deleteBtns.length > 0) {
        deleteListeners = 1;

        deleteBtns.forEach(function(deleteButton) {
            deleteButton.addEventListener('click', deleteHandler);
        })
    }
};


// on/off
function schOnOff() {
    //console.log('on off listener activate');
    let toggles = document.querySelectorAll('.schActv');
    toggles.forEach(function(toggle) {
        toggle.removeEventListener('change', toggleSearch);
        toggle.addEventListener('change', toggleSearch);
    });
}


// drag & drop sort
function removeDragListeners() {
    //console.log('removing listeners');
    if(dragListeners === 1) {
        schArea.removeEventListener('mousedown', mousedown);
        draggables.forEach(schCont => {
            schCont.removeEventListener('dragstart', dragstart);
            schCont.removeEventListener('dragend', dragend);
        });
        schArea.removeEventListener('dragover', dragover);
        schArea.removeEventListener('drop', drop);
        schArea.removeEventListener('mouseup', mouseup);
        draggedIndicator = 0;
        dragListeners = 0;
    }
}

function dragAndDrop () {
    removeDragListeners();
    updateDraggables();

    if(draggables.length > 0) {
        dragListeners = 1;

        schArea.addEventListener("mousedown", mousedown = function(event) {
            if (event.target.classList.contains('btnReorder')) {
                schCont = event.target.closest('.schCont');
                schCont.setAttribute('draggable', 'true');
            }
        });
        
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', dragstart = () => {
                draggable.classList.add('dragging')
            })
        
            draggable.addEventListener('dragend', dragend = () => {
                draggable.classList.remove('dragging')
            })
        })
        
        schArea.addEventListener('dragover', dragover = e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(schArea, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                schArea.appendChild(draggable);
            } else {
                schArea.insertBefore(draggable, afterElement);
            }
        })
        
        schArea.addEventListener("drop", drop = function(event) {
            event.preventDefault();
            removeDrag();
            saveCheck();
            draggedIndicator = 1;
        });
        
        schArea.addEventListener("mouseup", mouseup = function() {
            removeDrag();
        });
    }
}


//schCont resize with window
window.addEventListener('resize', adjustSchWidth);
adjustSchWidth();