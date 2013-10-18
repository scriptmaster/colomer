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
	if(!sliderStarted) {
		slider = $('.bxslider').bxSlider();
		sliderStarted = true;
	}
	$('#page_splash').hide();
	$('#page_home').show();
}

function load_page(country){
	$.mobile.activePage.animate({
		marginLeft: "0px",
	}, 300, function () {
		menuStatus = false
		$('#menu').hide();
	});
	slider.destroySlider();
	$('#page_home').hide();	
	window.localStorage.setItem("language", country);	
	var sss = '';
	if($(window).width() < 320){
		sss = 'res/screen/android/'+country+'/screen-ldpi-portrait.png';
	}else if($(window).width() >= 320 || $(window).width() < 480){
		sss = 'res/screen/android/'+country+'/screen-mdpi-portrait.png';
	}else if($(window).width() >= 480 || $(window).width() < 720){
		sss = 'res/screen/android/'+country+'/screen-hdpi-portrait.png';
	}else if($(window).width() >= 720){
		sss = 'res/screen/android/'+country+'/screen-xhdpi-portrait.png';
	}
	var ss_image = '<img src="'+sss+'" width="'+$(window).width()+'" height="'+$(window).height()+'" />';
	$('#page_splash').html(ss_image);
	$('#page_splash').show();	
	$.ajax({
			type       : "POST",
			url        : "http://system-hostings.dev.wiredelta.com/colomer/api/offers/app_offers",
			crossDomain: true,
			beforeSend : function() {$.mobile.loading('show')},
			complete   : function() {$.mobile.loading('hide')},
			dataType   : 'json',
			success    : function(response) {				
				var offers = '';
				for(var i=0; i < response.data.length; i++){
					offers += '<li><img src="'+response.data[i].image+'" /><div class="bx-caption-text" onclick="window.open(&quot;'+response.data[i].url+'&quot;, &quot;_system&quot;);">More Info >></div></li>';
				}				
				$('.bxslider').html(offers);
				setTimeout('home_page()', 4000);
			},
			error      : function() {
				alert('Not working!');
			}
	});
}



var language;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	checkStorage();
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
	$('#page_splash').html(ss_image);
	
	$.ajax({
		type       : "POST",
		url        : "http://system-hostings.dev.wiredelta.com/colomer/api/offers/app_offers",
		crossDomain: true,
		beforeSend : function() {$.mobile.loading('show')},
		complete   : function() {$.mobile.loading('hide')},
		dataType   : 'jsonp',
		success    : function(response) {
			//console.error(JSON.stringify(response));
			var offers = '';
			for(var i=0; i < response.data.length; i++){
				offers += '<li><img src="'+response.data[i].image+'" /><div class="bx-caption-text" onclick="window.open(&quot;'+response.data[i].url+'&quot;, &quot;_system&quot;);">More Info >></div></li>';
			}
			$('.bxslider').html(offers);
			setTimeout('home_page()', 4000);
		},
		error      : function() {
			var offers = '';
			var images = [
				'http://system-hostings.dev.wiredelta.com/colomer/api/images/offers/pic1.png',
				'http://system-hostings.dev.wiredelta.com/colomer/api/images/offers/pic2.png',
				'http://system-hostings.dev.wiredelta.com/colomer/api/images/offers/pic3.png',
				'http://system-hostings.dev.wiredelta.com/colomer/api/images/offers/pic4.png'
			];
			for(var i=0; i < images.length; i++){
				offers += '<li><img src="'+images[i]+'" /><div class="bx-caption-text" onclick="window.open(&quot;'+images[i]+'&quot;, &quot;_system&quot;);">More Info >></div></li>';
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
    		window.localStorage.setItem("language", "denmark");
    	} 
	language = window.localStorage.getItem("language");
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
	//navigator.geolocation.clearWatch(window.watchPositionID);
	//window.savedPosition = position;
	//alert('Latitude: ' + position.coords.latitude);
    //alert('Longitude: ' + position.coords.longitude);
}

// Show an alert if there is a problem getting the geolocation
//
function geoFailure(err) {
	alert(['Error:',err.code,err.message]);
}
