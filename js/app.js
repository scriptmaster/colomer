var slider;

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
	slider = $('.bxslider').bxSlider();
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