/**
 * Sort tabs web extension
 */

/**
 * menu definitions
 */
let menuDefs = [{
	id : "sort-by-url-asc",
	title : "sort by url (asc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-url-asc-16.png"
	}
}, {
	id : "sort-by-url-desc",
	title : "sort by url (desc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-url-desc-16.png"
	}
}, {
	id : "sort-by-domain-asc",
	title : "sort by domain (asc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-domain-asc-16.png"
	}
}, {
	id : "sort-by-domain-desc",
	title : "sort by domain (desc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-domain-desc-16.png"
	}
}, {
	id : "sort-by-title-asc",
	title : "sort by title (asc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-title-asc-16.png"
	}
}, {
	id : "sort-by-title-desc",
	title : "sort by title (desc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-title-desc-16.png"
	}
}, {
	id : "sort-by-creation-time-asc",
	title : "sort by creation time (asc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-access-time-asc-16.png"
	}
}, {
	id : "sort-by-creation-time-desc",
	title : "sort by creation time (desc)",
	contexts : ["tools_menu", "browser_action"],
	icons : {
		16 : "icons/sort-icon-access-time-desc-16.png"
	}
}];

let settingsDefs = [{
	id : "settings-sort-auto",
	title : "sort automatically",
	contexts : ["tools_menu", "browser_action"]
}, {
  id: "settings-sort-pinned",
  title: "sort pinned tabs",
	contexts : ["tools_menu", "browser_action"]
}];


function onError(error) {
  console.trace(error);
}

async function initializeSettings() {
	let defaultDict = settingsDefs.reduce(
	  (acc, cur) => Object.assign(acc, {[cur.id]: false}),
	  {});
  
	let settings = await browser.storage.local.get(defaultDict);
  return settings;
}

function clickHandler(evt, settings) {
  let backgroundWindow = browser.runtime.getBackgroundPage();
  backgroundWindow.then(
    (w) => w.sortTabsComparatorName(evt.target.id, settings))
		.then(
      (tab) => {
        console.log("Click handler: " + evt.target.id);
        return browser.storage.local.set({
          "last-comparator": evt.target.id
        }).then(
				  () => window.close(),
          onError);
			}, onError);
}

function settingsClickHandler(evt, settings) {
  let backgroundWindow = browser.runtime.getBackgroundPage();
  return backgroundWindow.then(
    (w) => w.settingChanged(evt));
}

function createButton(buttonDef, settings) {
	let newEl = document.createElement('div');
	newEl.id = buttonDef.id;
  newEl.innerText = buttonDef.title;
	// newEl.src = "../" + buttonDef.icons[16];
	newEl.addEventListener(
    "click",
    (evt) => clickHandler(evt, settings));
	return newEl;
}

function createSettingsToggle(buttonDef, settings) {
  let newEl = document.createElement('div');
  newEl.id = buttonDef.id;
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = buttonDef.id;
  checkbox.name = buttonDef.id;
  let label = document.createElement('label');
  label.innerText = buttonDef.title;
  label.htmlFor = buttonDef.id;
  checkbox.checked = settings[buttonDef.id];

  newEl.appendChild(checkbox);
  newEl.appendChild(label);
  newEl.addEventListener(
    "click",
    (evt) => settingsClickHandler(evt, settings));
  return newEl;
}

function createPopup(settings) {
  console.log(settings);
  const settingsGroup = document.createElement("div");
  const settingsButtons = settingsDefs.map(
    (def) => createSettingsToggle(def, settings));
  settingsButtons.forEach((button) => settingsGroup.appendChild(button));

  const buttons = menuDefs.map(
    (menuDef) => createButton(menuDef, settings));
  const buttonGroup = document.createElement("div");
  buttons.forEach((button) => buttonGroup.appendChild(button));

	let cont = document.getElementById("options");
	cont.appendChild(buttonGroup);
  cont.appendChild(document.createElement("hr"));
  let settingsCont = document.getElementById("settings");
  settingsCont.appendChild(settingsGroup);
}

/**
 * init
 */
document.addEventListener(
  "DOMContentLoaded",
  (evt) => {
    initializeSettings().then(
      (settings) => {
        createPopup(settings);
      }, onError);
  });
