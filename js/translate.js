/*
 * This file is part of Wikitranslate.

 * Wikitranslate is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Wikitranslate is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with Wikitranslate.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

	//the list of languages we're gonna get from wikipedia
	var langsList = null;

	//starts the process of getting the translation
	function getTranslationsForTitle(sourceln, destln, title) {
		sourceln = encodeURIComponent(sourceln);
		destln = encodeURIComponent(destln);
		title = encodeURIComponent(title);

		var xhr = new XMLHttpRequest(),
			requestURL = "api/tr.php?title=" + title + "&srcln=" + sourceln + "&destln=" + destln;

		xhr.open("GET", requestURL, true);
		
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				displayResult(JSON.parse(xhr.responseText.replace("*", "title")));
			}
		}

		xhr.send();
	}

	//displays the translation from the JSON response
	function displayResult(data) {
		var page;

		for(pageId in data.query.pages) {
			if(data.query.pages.hasOwnProperty(pageId) && pageId !== '-1') {
				page = data.query.pages[pageId];
			}
		}

		if(page === void 0) {
			alert("Could not find a Wikipedia page with that title.");
		} else if(page.langlinks === void 0) {
			alert("This page has no translation available in that language.");
		} else {
			alert(page.title + " in " + getLanguageFromCode(page.langlinks[0].lang) + " is " + page.langlinks[0].title + ".");
		}
	}

	//populates langsList with all the languages available in wikipedia
	function getAllLanguages() {
		var xhr = new XMLHttpRequest(),
			requestURL = "api/lang.php";

		xhr.open("GET", requestURL, true);
		
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				var langs = JSON.parse(xhr.responseText.replace(/\*/g, "name"));
				langsList = langs.query.languages;
				displayLanguages();
			}
		}

		xhr.send();
	}

	//searches for the name of a language, based on its code
	function getLanguageFromCode(code) {
		if(langsList !== null) {
			for(var i = 0; i < langsList.length; i++) {
				if(langsList[i].code === code) {
					return langsList[i].name;
				}
			}
		}
	}

	//display the languages in their drop down lists
	function displayLanguages() {
		var srclist = document.getElementById("srclang");
		var destlist = document.getElementById("destlang");
		
		srclist.innerHTML = destlist.innerHTML = "";

		for (i = 0; i < langsList.length; i++) {
			if(langsList[i].code.indexOf("-") === -1) {
				var o = document.createElement("option");
				o.text = langsList[i].code + " - " + langsList[i].name;
				o.value = langsList[i].code;

				if(langsList[i].code === "en") {
					o.selected = true;
				}

				srclist.appendChild(o);

				var o = document.createElement("option");
				o.text = langsList[i].code + " - " + langsList[i].name;
				o.value = langsList[i].code;

				if(langsList[i].code === "fr") {
					o.selected = true;
				}

				destlist.appendChild(o);
			}
		}
	}

	//main code
	//get the languages
	getAllLanguages();

	//affects the submit button to its action
	document.getElementById("submit").addEventListener("click", function() {
		var title = document.getElementById("title").value;
		var srclang = document.getElementById("srclang").value;
		var destlang = document.getElementById("destlang").value;

		getTranslationsForTitle(srclang, destlang, title);
	});

})();