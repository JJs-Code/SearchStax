//vars
let storedData = JSON.parse(localStorage.getItem("schData"));
let urls = storedData ? storedData : defaultSearches;
let bmStoredData = JSON.parse(localStorage.getItem('bmData'));
let bmData = bmStoredData ? bmStoredData : defaultBookmarks;
const header = document.getElementById('headerBar');
const schAreaCont = document.getElementById('schBarCont');
const schArea = document.getElementById('searchBars');
const bmMainCont = document.getElementById('bmMainCont');
const bmArea = document.getElementById('bmArea');
const AIChat = document.getElementById('AIChat');

/*INITIALIZE*/

initialize();

function initialize() {
	bgImgBlur();

	if (storedData) {
		addSearchElements(storedData);
	} else {
		addSearchElements(defaultSearches);
	}

	if (bmStoredData) {
		addBookmarks(bmStoredData);
	}
}

//sets the background blur level
function bgImgBlur() {
	const bgImg = document.getElementById('bgImg');
	const blur = localStorage.getItem('blurIntensity');
	bgImg.style.filter = `blur(${blur}px)`;
}

//adds search elements
function addSearchElements(data) {
	const entries = Object.entries(data);
	for (const [name, { url }] of entries) {
		if(data[name].state === "on") {
			const codeName = name.replace(/\s+/g, "-");

			//add container
			const schDiv = document.createElement("div");
			schDiv.className = "inputContainer";
			schDiv.id = `container-${codeName}`;
			schArea.appendChild(schDiv);
	
			//add search input
			const schInput = document.createElement("input");
			schInput.type = "search";
			schInput.name = name;
			schInput.placeholder = name;
			schInput.id = codeName;
			schDiv.appendChild(schInput);
			
			//add favicon
			const rootDomain = new URL(url).hostname;
			const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${rootDomain}&size=32`;
	
			const anchor = document.createElement("a");
			anchor.href = `http://${rootDomain}`;
			anchor.target = "_blank";
		
			const img = document.createElement("img");
			img.src = faviconUrl;
			img.className = 'engine-icon';
		
			anchor.appendChild(img);
			schDiv.appendChild(anchor);
		}
	}
}

//add bookmarks
function addBookmarks(data) {
	if (data && data != {}) {
		const entries = Object.entries(data);
		for (const [name, { url }] of entries) {
			if(data[name].state === "on") {
				
				//add container link
				const bmLnk = document.createElement("a");
				bmLnk.className = "bmContainer";
				bmLnk.href = url;
				bmArea.appendChild(bmLnk);
				
				//add icon
				const rootDomain = new URL(url).hostname;
				const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${rootDomain}&size=64`;
		
				const img = document.createElement("img");
				img.className = 'bmImg';
				img.src = faviconUrl;
				bmLnk.appendChild(img);
	
				const bmTitle = document.createElement("p");
				bmTitle.className = 'bmTitle';
				bmTitle.innerHTML = name;
				bmLnk.appendChild(bmTitle);			
			}
		}
	}
}

// Function to insert favicon into HTML
function insertFavicon(container, faviconUrl, rootDomain, iconClass) {
	const anchor = document.createElement("a");
	anchor.href = `http://${rootDomain}`;
	anchor.target = "_blank";

	const img = document.createElement("img");
	img.src = faviconUrl;
	img.className = iconClass;

	anchor.appendChild(img);
	container.appendChild(anchor);
}


/*SEARCH FUNCTIONALITY*/

//detect search bar clicked
document.addEventListener("click", function (clicked) {
	let element = clicked.target;
	let tag = element.tagName;
	if (tag === "INPUT") {
		let engine = element.id;
		createSearchUrl(engine);
	}
});

//on enter, finds correct url and inputs query
function createSearchUrl(engine) {
	let input = document.getElementById(engine);
	input.addEventListener("keydown", function (submit) {
		if (submit.key === "Enter") {
			submit.preventDefault();
			let query = input.value;
			let schUrl =  urls[engine].url
			let search = schUrl.replace('SEARCHTEXT', query);
			if (query !== "") {
				window.open(search, "_blank");
				input.value = "";
			} else {
				console.error("Search not completed for ", search);
			}
		}
	});
}

/*OUTLINE COLORS*/

//input outline color on focus
const style = document.createElement("style");
const anim = localStorage.getItem('googleAnim');
const colors = localStorage.getItem('borderColors');
let css = "";
for (var engine in urls) {
	if (engine.includes("Google") && anim != '"off"') {
		colorAnimations(engine);
	} else if (colors != '"off"') {
		css += `input#${engine}:focus { outline-color: ${urls[engine].color};}\n`;
	}
}
style.innerHTML = css;
document.head.appendChild(style);

//input outline color animations
function colorAnimations(engine) {
	if (engine.includes("Google")) {
		css += `input#${engine}:focus { animation: googleColors 4s; animation-iteration-count: infinite; }\n`;
	} else {
		css += `input#${engine}:focus { outline-color: #FFFFFF;}\n`;
	}
}

/*DYNAMIC HIDE*/

//detect item by class name
function dynamicHide() {
	let hideItems = document.querySelectorAll(".dynHide");
	hideItems.forEach(function (element) {
		if (window.innerWidth < 1111) {
			element.classList.add("hidden");
		} else {
			element.classList.remove("hidden");
		}
	});
}

//call functions
dynamicHide();
window.addEventListener("resize", dynamicHide);


/*SEARCH SPACING*/
function setDynamicHeight (elem, gap) {
    const maxGap = gap; //px
    const schBarCont = document.getElementById(elem);
    const schCount = schBarCont.children.length;
    const calcHeight = schCount * maxGap;
    const maxHeight = window.innerHeight - 70;
    const setHeight = calcHeight > maxHeight ? maxHeight : calcHeight;
    schBarCont.style.maxHeight = setHeight + 'px';
}

setDynamicHeight('searchBars', 150);
setDynamicHeight('bmArea', 150);
/*document.getElementById('bmMainCont').addEventListener('click', function() {
	setDynamicHeight('bmArea', 150);
	console.log('resetting height');
});*/


/*BASIC SETTINGS*/

//hide logo
const logo = document.getElementById('headingContainer');
const showLogo = localStorage.getItem('showLogo');
if (showLogo == '"off"') {
	console.log('executing show logo');
	logo.classList.add('hidden');
	header.style.background = 'none';
	schAreaCont.style.height = '100%';
	schAreaCont.style.top = 0;
	bmMainCont.style.height = '100%';
	bmMainCont.style.top = 0;
	AIChat.style.height = '100%';
	AIChat.style.top = 0;
}

//swap bookmarks side
const swapSetting = localStorage.getItem('swapBookmarks');
const swapSide = swapSetting ? swapSetting : '"on"';
if (swapSide == '"off"') {
	bmMainCont.classList.remove('LinkLeft');
	bmMainCont.classList.add('LinkRight');
	AIChat.classList.remove('LinkRight');
	AIChat.classList.add('LinkLeft');
}