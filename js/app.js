var slider, sliderStarted;

$(document).bind("mobileinit", function () {
    $.mobile.pushStateEnabled = true;
});

$(function () {
    var menuStatus;
    var show = function() {
        if(menuStatus) {
            return;
        }
        $('#menu').show();
        $.mobile.activePage.animate({
            marginLeft: "70%",
        }, 300, function () {
            menuStatus = true
        });
    };
    var hide = function() {
        if(!menuStatus) {
            return;
        }
        $.mobile.activePage.animate({
            marginLeft: "0px",
        }, 300, function () {
            menuStatus = false
            $('#menu').hide();
        });
    };
    var toggle = function() {
        if (!menuStatus) {
            show();
        } else {
            hide();
        }
        return false;
    };
 
    // Show/hide the menu
    $("a.showMenu").click(toggle);
    //$('#menu, .pages').on("swipeleft", hide);
    //$('.pages').on("swiperight", show);
	$('#menu').on("swipeleft", hide);
 
    $('div[data-role="page"]').on('pagebeforeshow', function (event, ui) {
        menuStatus = false;
        $(".pages").css("margin-left", "0");
    });

    // Menu behaviour
    $("#menu li a").click(function () {
        var p = $(this).parent();
        p.siblings().removeClass('active');
        p.addClass('active');
    });

});

function home_page(){
	/*
	if(!sliderStarted) {
		slider = $('.bxslider').bxSlider();
		sliderStarted = true;
	}
	*/

	slider = $('.bxslider').bxSlider();

	$('#page_splash').hide();
	$('#page_home').show();
}

function load_page(lang){
	$.mobile.activePage.animate({
		marginLeft: "0px",
	}, 300, function () {
		menuStatus = false
		$('#menu').hide();
	});
	slider.destroySlider();
	$('#page_home').hide();
	// window.localStorage.setItem("language", lang);
	language = lang;

	loadOffers();
}

function load_contact_page(){
	$('#page_home').hide();
	$('#menu').hide();
 	$('#page_contact').show();
 	
}


var language;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	checkStorage();
	loadOffers();
}

function loadOffers() {

	var sss = '';

	if($(window).width() < 320){
	    sss = 'res/screen/android/'+language+'/screen-ldpi-portrait.png';
	}else if($(window).width() >= 320 || $(window).width() < 480){
	    sss = 'res/screen/android/'+language+'/screen-mdpi-portrait.png';
	}else if($(window).width() >= 480 || $(window).width() < 720){
	    sss = 'res/screen/android/'+language+'/screen-hdpi-portrait.png';
	}else if($(window).width() >= 720){
	    sss = 'res/screen/android/'+language+'/screen-xhdpi-portrait.png';
	}

	var ss_image = '<img src="'+sss+'" width="'+$(window).width()+'" height="'+$(window).height()+'" />';
	$('#page_splash').html(ss_image).show();

	$('#content').html('<ul class="bxslider"></ul>');

	
	$.getJSON('http://system-hostings.dev.wiredelta.com/colomer/api/offers/app_offers', function(data){
		var offers = '';
		for(var i=0; i < data.data.length; i++){
			offers += '<li onclick="window.open(\''+data.data[i].url+'\', \'_system\');"><img src="'+data.data[i].image+'" /></li>';
		}
		alert(offers);
		alert(JSON.stringify(data));
		// $('.bxslider').html(offers);
		// setTimeout('home_page()', 4000);
	});

	$.ajax({
		type       : "GET",
		url        : "http://system-hostings.dev.wiredelta.com/colomer/api/offers/app_offers",
		crossDomain: true,
		beforeSend : function() {$.mobile.loading('show')},
		complete   : function() {$.mobile.loading('hide')},
		dataType   : 'jsonp',
		success    : function(response) {
			//console.error(JSON.stringify(response));
			var offers = '';
			for(var i=0; i < response.data.length; i++){
				// offers += '<li><img src="'+response.data[i].image+'" /><div class="bx-caption-text" onclick="window.open(&quot;'+response.data[i].url+'&quot;, &quot;_system&quot;);">More Info >></div></li>';
				offers += '<li onclick="window.open(\''+response.data[i].url+'\', \'_system\');"><img src="'+response.data[i].image+'" /></li>';
			}
			$('.bxslider').html(offers);
			setTimeout('home_page()', 4000);
		},
		error      : function() {
			var offers = '';
			var images = [
				'images/offers/pic1.jpg',
				'images/offers/pic2.jpg',
				'images/offers/pic3.jpg',
				'images/offers/pic4.jpg'
			];

			for(var i=0; i < images.length; i++){
				offers += '<li><img src="'+images[i]+'" /></li>';
			}

			$('.bxslider').html(offers);
			setTimeout('home_page()', 4000);
		}
	});
}

function checkStorage() {
	var location = findLocation();
	language = window.localStorage.getItem("language");
	if(language == null){
		language = "denmark";
    		window.localStorage.setItem("language", language);
    	}
}

function findLocation() {
	//window.watchPositionID = navigator.geolocation.watchPosition(geoSuccess, geoFailure, {enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 });
	//var options = { timeout: 30000 };
	//watchID = navigator.geolocation.watchPosition(geoSuccess, geoFailure, options);
	navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
	/*element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
    'Longitude: ' + position.coords.longitude     + '<br />' +
    '<hr />'      + element.innerHTML;*/
}

function geoSuccess(position) {
	//alert([position.coords.latitude, position.coords.longitude]);
	//$.get('http://ws.geonames.org/countryCode?lat=49.03&lng=10.2', function(data){
	//	alert('[49.03,10.2]='+data);
	//});
	$.get('http://ws.geonames.org/countryCode?lat='+position.coords.latitude+'&lng='+position.coords.longitude,
		function(data){
			// alert('CountryCode='+data);
			if(data == 'DK') {
				window.localStorage.setItem("language", "denmark");
			}
			//loadOffers();
		});
	//navigator.geolocation.clearWatch(window.watchPositionID);
	//window.savedPosition = position;
	//alert('Latitude: ' + position.coords.latitude);
    //alert('Longitude: ' + position.coords.longitude);
}

// Show an alert if there is a problem getting the geolocation
//
function geoFailure(err) {
	if(err.message) {
		// alert('Please enable GPS');
		window.localStorage.setItem("language", "denmark");
	}
	// loadOffers();
	// alert(['Error:',err.code,err.message]);
}
