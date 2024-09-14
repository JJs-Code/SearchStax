// vars
const bmArea           = document.getElementById('bmDataCont');
let firstBmChild       = bmArea.querySelector('div.bmCont');
let bmDraggables       = document.querySelectorAll('.bmCont');
let bmStoredData       = JSON.parse(localStorage.getItem('bmData'));
let bmDeleteBtns       = document.querySelectorAll('.bm-btn[title="delete"]');
let bmDelWarnLs        = JSON.parse(localStorage.getItem('delWarn'));
let bmDelWarn          = bmDelWarnLs ? bmDelWarnLs : 'on';
let bmWarningMsg       = document.getElementById('bmWarningMsg');
let bmNameMsg          = document.getElementById('bmNameMsg');
let bmUrlMsg           = document.getElementById('bmUrlMsg');
let bmUniqueNameMsg    = document.getElementById('bmUniqueNameMsg');
let bmSavedMsg         = document.getElementById('bmSavedMsg');
let bmDaaListener      = 0;
let bmDeleteListeners  = 0;
let bmDraggedIndicator = 0;
let bmDragListeners    = 0;

// initialise
bmInitialise();

// functions

function bmUpdateAll() {
    bmUpdate1stChild();
    bmUpdateDraggables();
    bmUpdateStoredData();
    bmUpdateDeleteBtns();
    bmUpdateDeleteWarn();
    bmUpdateWarningMsgs();
    bmDetectDelete();
    stgOnOffAll();
    bmRunListeners();
    //console.log('bm updating all');
}

function bmUpdate1stChild()    {firstBmChild    = bmArea.querySelector('div.bmCont');}
function bmUpdateDraggables()  {bmDraggables    = document.querySelectorAll('.bmCont');}
function bmUpdateStoredData()  {bmStoredData    = JSON.parse(localStorage.getItem('bmData'));}
function bmUpdateDeleteBtns()  {bmDeleteBtns    = document.querySelectorAll('.bm-btn[title="delete"]');}
function bmUpdateDeleteWarn()  {bmDelWarn       = JSON.parse(localStorage.getItem('delWarn')) || 'on';}
function bmUpdateWarningMsgs() {bmWarningMsg    = document.getElementById('bmWarningMsg');
                                bmNameMsg       = document.getElementById('bmNameMsg');
                                bmUrlMsg        = document.getElementById('bmUrlMsg');
                                bmUniqueNameMsg = document.getElementById('bmUniqueNameMsg');
                                bmSavedMsg      = document.getElementById('bmSavedMsg');}

function bmRunListeners() {
    bmDetectDelete();
    bmSchOnOff();
    bmDragAndDrop();
}

function bmInitialise() {
    if (bmStoredData) {
        bmAddBmConts(bmStoredData);
    }
    //console.log('bm initialise');
    bmUpdateAll();
}

function bmAddBmConts(obj) {
    var entries = Object.entries(obj).reverse();
    entries.forEach(([name, key]) => {
        var newBmCont = document.createElement('div');
        newBmCont.className = 'bmCont';
        newBmCont.id = name != 'blank' ? name.replace(/\s+/g, '_') : 'newBm';
        newBmCont.innerHTML = bmHtml(name, key);
        bmUpdate1stChild();
        if (firstBmChild) {
            bmArea.insertBefore(newBmCont, firstBmChild);
        } else {
            bmArea.appendChild(newBmCont);
        }
        bmUpdateAll();
    });
}

function bmSaveCheck() {
    let i = 0;
    let {badName, badUrl} = bmBadSyntax();

    if (!bmDataEntered()) {
        bmShowWarningMsg();
        i++;
    } else {bmRemoveMsgs(bmWarningMsg)}

    if (badName) {
        bmShowNameMsg();
        i++;
    } else {bmRemoveMsgs(bmNameMsg)}

    if (badUrl) {
        bmShowUrlMsg();
        i++;
    } else {bmRemoveMsgs(bmUrlMsg)}

    if (bmUniqueName()) {
        bmShowUniqueNameMsg();
        i++;
    } else {bmRemoveMsgs(bmUniqueNameMsg)}
    
    if (i == 0) {
        bmShowSavedMsg();
    } else {bmRemoveMsgs(bmSavedMsg)}

    bmUpdateAll();
}

function bmDataEntered() {
    bmUpdateAll();

    if (!firstBmChild) {
        return true;
    }

    let nameInput = firstBmChild.querySelector('.bmName');
    let urlInput = firstBmChild.querySelector('.bmUrl');
    let calc = nameInput.value.trim() && urlInput.value.trim();
    return calc;
}

function bmBadSyntax() {
    //console.log('bad syntax activate')
    let badName = false;
    let badUrl = false;
    document.querySelectorAll('.bmName').forEach(input => {
        if (/[^a-zA-Z0-9\s]/.test(input.value)) badName = true;
    });
    document.querySelectorAll('.bmUrl').forEach(url => {
        //console.log(`url value = ${url.value}`);
        if (url.value.substring(0,4) != 'http' && url.value != '') {
            badUrl = true;
        }
    });
    return { badName, badUrl };
}

function bmUniqueName() {
    const inputs = document.querySelectorAll('.bmName');
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

function bmRemoveMsgs(msgElem) {
    bmUpdateWarningMsgs();
    if (msgElem) {
        msgElem.remove();
    }
}

function bmShowMessage(msgId, msgClass, flashClass, msgContent) {
    bmUpdateWarningMsgs();
    let msgElem = window[msgId];
    if (!msgElem) {
        bmUpdate1stChild();
        msgElem = document.createElement('p');
        msgElem.id = msgId;
        msgElem.classList.add('bmMsg', msgClass);
        msgElem.innerHTML = msgContent;
        bmArea.insertBefore(msgElem, firstBmChild);
    } else {
        msgElem.classList.add(flashClass);
        setTimeout(() => {
            msgElem.classList.remove(flashClass);
        }, 500); 
    }
}

function bmShowWarningMsg() {
    bmShowMessage(
        'bmWarningMsg',
        undefined,
        'bmWarningFlash',
        'Fill in all input fields before saving or adding new bookmarks'
    );
}

function bmShowNameMsg() {
    bmShowMessage(
        'bmNameMsg', 
        'bmSyntaxMsg', 
        'bmSyntaxFlash',
        "Only letters, numbers, and spaces are allowed in the 'Name' field"
    );
}

function bmShowUrlMsg() {
    bmShowMessage(
        'bmUrlMsg', 
        'bmSyntaxMsg', 
        'bmSyntaxFlash',
        "The 'URL' field must include the 'https://' prefix"
    );
}

function bmShowUniqueNameMsg() {
    bmShowMessage(
        'bmUniqueNameMsg', 
        'bmSyntaxMsg', 
        'bmSyntaxFlash',
        'New name cannot be the same as already existing bookmark name'
    );
}

function bmShowSavedMsg() {
    bmSaveBookmark();
    bmUpdateDeleteBtns();
    bmUpdateWarningMsgs();
    bmShowMessage(
        'bmSavedMsg', 
        undefined, 
        'bmSavedFlash',
        'Saved!'
    );
}

function bmSaveBookmark() {
    const bmData = {};
    let bmContElement = '';

    const nameInputs = document.querySelectorAll('.bmName');
    nameInputs.forEach(function (nameInput) {
        bmContElement = nameInput.closest('.bmCont');
        let nameValue = nameInput.value;
        bmContElement.id = nameValue.replace(/\s+/g, '_');
        bmData[nameValue] = {};

        function inputs(className, prop) {
            const input = bmContElement.querySelector(`.${className}`);
            let inputValue = '';
            if (prop == 'state') {
                inputValue = input.checked == true ? 'on' : 'off';
            } else {
                inputValue = input.value;
            }
            bmData[nameValue][prop] = inputValue;
            //console.log('saving bookmark for ' + className + '\tin ' + nameValue);
        }

        inputs('bmUrl',   'url');
        inputs('bmActv',  'state');
        bmUpdateAll();
        //location.reload();
    })

    localStorage.setItem('bmData', JSON.stringify(bmData));
    bmStoredData = JSON.parse(localStorage.getItem('bmData'));
    bmUpdateAll();
};

function bmInsertDeleteWarning(click) {
    const bmDelMsgBox = document.getElementById('delMsgBox');
    if (!bmDelMsgBox) {
        document.getElementById('bookmarks').insertAdjacentHTML("beforeend", deleteWarningHTML());
        let checkbox = document.getElementById('daa-cb');
        let checkboxClickArea = document.getElementById('daaText');
        bmUpdateDeleteWarn();

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
            bmUpdateDaaLocalStorage();
        }

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                delWarn = 'off';
            } else {
                delWarn = 'on';
            };
            bmUpdateDaaLocalStorage();
        });
            
        function bmUpdateDaaLocalStorage() {
            localStorage.setItem('delWarn', JSON.stringify(delWarn));
            bmUpdateDeleteWarn();
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
            bmDeleteBookmark(click);
        })
    }
}

function bmDeleteBookmark(click) {
    //console.log('delete clicked');
    click.preventDefault();
    let bmContElement = click.target.closest('.bmCont');
    let nameId = bmContElement.id.replace(/_/g, ' ');
    bmContElement.remove();
    bmUpdateStoredData();
    delete bmStoredData[nameId];
    bmSaveCheck();
    localStorage.setItem('bmDelWarn', JSON.stringify(bmDelWarn));
    bmUpdateAll();
}

function bmRemoveDrag() {
    var bmConts = document.querySelectorAll('[draggable="true"]');
    bmConts.forEach(function(bmCont) {
        bmCont.removeAttribute('draggable');
    });
}

function bmGetDragAfterElement(bmArea, y) {
    const draggableElements = [...bmArea.querySelectorAll('.bmCont:not(.dragging)')]
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

// LISTENERS

// add new
document.getElementById('bmAddNew').addEventListener('click', function(click) {
    click.preventDefault();
    bmRemoveMsgs(bmSavedMsg);
    if (bmDataEntered()) {
        //console.log('adding new bookmark field');
        let blankObj = {blank: ''};
        bmAddBmConts(blankObj);
        bmUpdateAll();
    } else bmShowWarningMsg();
});


// save
document.getElementById('bmSave').addEventListener('click', function(click) {
    click.preventDefault();
    bmSaveCheck();
});


// delete
function bmRemoveDeleteListeners() {
    if (bmDeleteListeners === 1) {
        bmDeleteBtns.forEach(function(deleteButton) {
            deleteButton.removeEventListener('click', bmDeleteHandler);
        })
        bmDeleteListeners = 0;
    }
};

function bmDeleteHandler(click) {
    bmUpdateDeleteWarn();
    if (delWarn != 'off') {
        bmInsertDeleteWarning(click);
    } else {
        bmDeleteBookmark(click);
        //console.log('delete detected');
    }
}

function bmDetectDelete() {
    bmRemoveDeleteListeners();
    bmUpdateDeleteBtns();

    if (bmDeleteBtns.length > 0) {
        bmDeleteListeners = 1;

        bmDeleteBtns.forEach(function(deleteButton) {
            deleteButton.addEventListener('click', bmDeleteHandler);
        })
    }
};


// on/off
function bmSchOnOff () {
    let toggles = document.querySelectorAll('.bmActv');
    toggles.forEach(function(toggle) {
        toggle.addEventListener('change', function() {
            let bmContElement = toggle.closest('.bmCont');
            let nameId = bmContElement.id.replace(/_/g, ' ');
            let toggleCheck = toggle.hasAttribute('checked');
            if (toggleCheck) {
                bmContElement.classList.add('inactive');
                toggle.removeAttribute('checked');
            } else {
                bmContElement.classList.remove('inactive');
                toggle.setAttribute('checked', '');
            }
            toggleCheck = toggle.hasAttribute('checked');
            bmStoredData[nameId]['state'] = toggleCheck ? 'on' : 'off';
            localStorage.setItem('bmData', JSON.stringify(bmStoredData));
        })
    });
}

function bmRemoveListeners() {
    //console.log('bm removing listeners');
    if(bmDragListeners === 1) {
        bmArea.removeEventListener('mousedown', bmMousedown);
        bmDraggables.forEach(bmCont => {
            bmCont.removeEventListener('dragstart', bmDragstart);
            bmCont.removeEventListener('dragend', bmDragend);
        });
        bmArea.removeEventListener('dragover', bmDragover);
        bmArea.removeEventListener('drop', bmDrop);
        bmArea.removeEventListener('mouseup', bmMouseup);
    }
}

function bmDragAndDrop() {
    bmRemoveListeners();
    bmUpdateDraggables();

    if (bmDraggables.length > 0) {
        bmDragListeners = 1;

        bmArea.addEventListener("mousedown", bmMousedown = function(event) {
            if (event.target.classList.contains('bmBtnReorder')) {
                bmCont = event.target.closest('.bmCont');
                bmCont.setAttribute('draggable', 'true');
            }
        });
        
        bmDraggables.forEach(bmCont => {
            bmCont.addEventListener('dragstart', bmDragstart = () => {
                bmCont.classList.add('dragging');
            });
        
            bmCont.addEventListener('dragend', bmDragend = () => {
                bmCont.classList.remove('dragging');
            });
        });
        
        bmArea.addEventListener('dragover', bmDragover = e => {
            e.preventDefault();
            const afterElement = bmGetDragAfterElement(bmArea, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                bmArea.appendChild(draggable);
            } else {
                bmArea.insertBefore(draggable, afterElement);
            }
        });
        
        bmArea.addEventListener("drop", bmDrop = function(event) {
            event.preventDefault();
            bmRemoveDrag();
            bmSaveCheck();
        });
        
        bmArea.addEventListener("mouseup", bmMouseup = function() {
            bmRemoveDrag();
        });
    }
}