// ==UserScript==
// @name           googleplusplus_hide_sidebars
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_sidebars
// @include        *plus.google.com*
// @description	   Changes appearance of Google Plus by hiding left and right side bars and widening main content containers. (Version 0.1.3 and earlier was originally release as simply googleplusplus).
// @version        0.2.0
// ==/UserScript==

function hideSidebars(){
	/****** Utility functions ******/
	function log(txt) {
		if(logging) {
			console.log(txt);
		}
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
			if( typeof window.localStorage.getItem(key) === 'undefined' ){
				v = null;
			}else{
				v = window.localStorage.getItem(key);
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
		setItem(name, value);
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

	function isExcludedPage(){
		var h = window.location.href;
		if(h.indexOf('/photos') > -1){ return true; }
		if(h.indexOf('/circles') > -1){ return true; }
		return false;
	}
	function reloadPage(){
		window.location.href = window.location.href;
	}
	function hookNavButtons(){
		$(".a-U-T a[href='/photos']").click(function(){
			setTimeout(function(){
				reloadPage();
			}, 2000);
		});
		$(".a-U-T a[href='/circles']").click(function(){
			setTimeout(function(){
				reloadPage();
			}, 2000);
		});
	}
	function isProfilePage(){
		return $('#contentPane').find('.vcard').length > 0;
	}
	function isCirclesPage(){
		return $('#contentPane').find('.oz-sg-people').length > 0;
	}

	/****** Helper functions ******/
	function do_show(){
		var cpaneKid = cpane.children(':first');
		var newPeople = cpaneKid.children().eq(2);
		var posts = $('.a-b-f-i');
		
		cpane.width(cpane_orig_width);
		newPeople.width(posts_orig_width);
		posts.width(posts_orig_width);
		
		leftbar.show();
		rightbar.show();
	}
	function do_hide(){
		cpane.width(cpane_new_width);
		cpane.css('border-right', 'none');
		leftbar.hide();
		rightbar.hide();
		var cpaneKid = cpane.children(':first');
		var cpaneKidKids = cpaneKid.children();
		var newPeople = cpaneKid.children().eq(2);
		var posts = $('.a-b-f-i');
		var topbar = $('#gbx4');

		var postWidth = toInt(topbar.width() * wfactorPost);
		if(postWidth > post_width_max){
			postWidth = post_width_max;
		}
		var newPeopleWidth = toInt(topbar.width() * wfactor);
		if(newPeopleWidth > newPeople_width_max){
			newPeopleWidth = newPeople_width_max;
		}

		newPeople.width(newPeopleWidth);
		posts.width(postWidth);
	}
	function do_show_or_hide(){
		if (cpane.length > 0) {
			if(show_hide_saved == 'shown'){
				do_show();
			}else if( show_hide_saved == 'hidden' ){
				do_hide();
			}
		}
	}
	/****** Constants ******/
	var logging = false;
	var wfactor = 0.8;
	var wfactorPost = 0.83;
	var cpane_orig_width = 574;
	var cpane_new_width = 800;
	var posts_orig_width = 532;
	var post_width_max = 1306;
	var newPeople_width_max = 1265;
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
			GM_setValue('gpp__hidden_sidebars', 'hidden');
			show_hide_saved = 'hidden';
			do_hide();
			t.text('Show Sidebars');
		}else{
			GM_setValue('gpp__hidden_sidebars', 'shown');
			show_hide_saved = 'shown';
			t.text('Hide Sidebars');
			do_show();
		}
	});
	hookNavButtons();
	
	/****** Loop ******/
	function main_loop(){
		if( isProfilePage() || isCirclesPage() ){
			sidebar_left_link.hide();
		}
		if( !isExcludedPage() ){
			sidebar_left_link.show();
			do_show_or_hide();
		}
		
	}
	
	/****** Start Loop ******/
	main_loop();
	setInterval(main_loop, 2000);
}

/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", protocol + "ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
var protocol = window.location.protocol + '//';
addJQuery(hideSidebars);