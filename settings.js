    /*ACTIVATE SETTING PAGE HILIGHT BY URL*/
    
// detects when url changes and reruns the code
function newUrl () {
    var currentUrl = window.location.href;    

      // Iterate through the properties of the menuPages object
      for (var pageName in menuPages) {
        var itemId = menuPages[pageName];
        var menuItemElement = document.getElementById(itemId);
        menuItemElement.classList.remove('active');
        if (currentUrl.includes(pageName)) {
            if (menuItemElement) {
                menuItemElement.classList.add('active');
            }
        }      
    }

    setTimeout(function() {stgOnOffAll();}, 5);
};

// Calls function
window.addEventListener('hashchange', newUrl);
newUrl();