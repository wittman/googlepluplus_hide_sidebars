// ==UserScript==
// @name           googleplusplus_hide_sidebars
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_sidebars
// @include        *plus.google.com*
// @description	   Changes appearance of Google Plus by hiding left and right side bars and widening main content containers. (Version 0.1.3 and earlier was originally release as simply googleplusplus).
// @version        0.1.4
// ==/UserScript==

function hideSidebars(){
	/****** Utility functions ******/
	function log(txt) {
		if(logging) {
			console.log(txt);
		}
	}
	
	function isUnset(inp) {
		return (typeof inp === 'undefined')
	}
	
	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
			if( isUnset(v) ){
				v = null;
			}
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		
		log("Returning value: " + v);
		return v;
	}

	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}

	function GM_setValue(name, value){
		setItem(name);
	}

	function GM_getValue(name, sDefault){
		var v = getItem(name);
		if(v == null){
			return sDefault;
		}else{
			return v;
		}
	}

	function GM_listValues(){
		return window.localStorage;
	}

	function GM_deleteValue(name){
		window.localStorage.removeItem(name);
	}
	
	function toInt(n){ return Math.round(Number(n)); }
	
	/****** Helper functions ******/
	function do_show(){
		var cpaneKid = cpane.children(':first');
		var newPeople = cpaneKid.children().eq(2);
		var posts = $('.a-b-f-i');
		
		cpane.width(574);
		newPeople.width(532);
		posts.width(532);
		
		leftbar.show();
		rightbar.show();
	}
	function do_hide(){
		cpane.width(800);
		leftbar.hide();
		rightbar.hide();
		var cpaneKid = cpane.children(':first');
		var cpaneKidKids = cpaneKid.children();
		var newPeople = cpaneKid.children().eq(2);
		var posts = $('.a-b-f-i');
		var topbar = $('#gbx4');

		var postWidth = toInt(topbar.width() * wfactorPost);
		if(postWidth > 1306){
			postWidth = 1306;
		}
		var newPeopleWidth = toInt(topbar.width() * wfactor);
		if(newPeopleWidth > 1265){
			newPeopleWidth = 1265;
		}

		newPeople.width(newPeopleWidth);
		posts.width(postWidth);
	}
	
	/****** Constants ******/
	var logging = false;
	var wfactor = 0.8;
	var wfactorPost = 0.83;
	var cpane = $('#contentPane');
	var leftbar = cpane.prev();
	var rightbar = cpane.next();
	var show_hide_saved = GM_getValue('gpp__hidden_sidebars', 'hidden');
	
	/****** Before Loop ******/
	var link_text = 'Hide Sidebars';
	if(show_hide_saved == 'hidden'){
		link_text = 'Show Sidebars';
	}
	leftbar.before('<div style="style="position:absolute"><br>&nbsp;&nbsp;<a id="gpp__show_hide_sidebars">' + link_text + '</a></div>');
	var sidebar_left_link = $('#gpp__show_hide_sidebars');
	sidebar_left_link.click(function(){
		var t = $(this);
		if( t.text().indexOf('Hide Sidebars') > -1 ){
			do_hide();
			GM_setValue('gpp__hidden_sidebars', 'hidden');
			show_hide_saved = 'hidden';
			t.text('Show Sidebars');
		}else{
			GM_setValue('gpp__hidden_sidebars', 'shown');
			show_hide_saved = 'shown';
			t.text('Hide Sidebars');
			do_show();
		}
	});
	
	/****** Loop ******/
	function main_loop(){
		if (cpane.length > 0) {
			if(show_hide_saved == 'shown'){
				do_show();
			}else if( show_hide_saved == 'hidden' && leftbar.is(':visible') ){
				do_hide();
			}
		}
	}
	
	/****** Start Loop ******/
	main_loop();
	setInterval(main_loop, 2000);
	
}

/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
addJQuery(hideSidebars);