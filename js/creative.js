(function($) {
	"use strict"; // Start of use strict

	function log(){if(window.console&&window.console.log)window.console.log.apply(window.console,arguments);}
	function getJson(url, callback){$.ajax({type:"GET",url:url,dataType:"json",cache:true,async:true,success:callback});}
	function getHtml(url, callback){$.ajax({type:"GET",url:url,dataType:"html",cache:true,async:true,success:callback});}

	if (typeof(jQuery)=='undefined' || !jQuery.fn) {log('jQuery is not included! Skipping template init!');return;}
	var config = window.creative||{}, version = config.version||'1.0';

	function initPageDynamicContentSections() {
		/*// Initialise the Metatags section
		getHtml("/seo/meta.min.html?v="+version, function(data) {
			var $el = $('<div/>').html(data), html = $el.html();
			$(document).ready(function() {
				$("head").append(html);
			});
		});*/

		/*// Initialise the Json+Ld
		var jsonLds = ["/seo/identity.ld.json?v="+version,"/seo/website.ld.json?v="+version,"/seo/place.ld.json?v="+version];
		for(var i in jsonLds){
			getJson(jsonLds[i], function(data){
				$("<script/>", {"type":"application/ld+json","html":JSON.stringify(data)}).appendTo("head");
			});
		}*/

		// Initialise the MainNav section
		var $mainNav = $("#mainNav");
		if ($mainNav.length > 0) {
			getHtml("/sections/mainNav.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#mainNav").html();
				$mainNav.html(html);
				// 
				// Highlight the top nav as scrolling occurs
				if (jQuery.fn.scrollspy) {
					$('body').scrollspy({
						target: '.navbar-fixed-top',
						offset: 51
					});
				}
				// Closes the Responsive Menu on Menu Item Click
				$('.navbar-collapse ul li a').on("click", function() {
					$('.navbar-toggle:visible').click();
				});
				// Offset for Main Navigation
				if (jQuery.fn.affix) {
					$('#mainNav').affix({
						offset: {
							top: 100
						}
					});
				}
			});
		}

		// Initialise the About section
		var $about = $("#about");
		if ($about.length > 0) {
			getHtml("/sections/about.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#about").html();
				$about.html(html);
			});
		}

		// Initialise the Services section
		var $services = $("#services");
		if ($services.length > 0) {
			getHtml("/sections/services.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#services").html();
				$services.html(html);
			});
		}

		// Initialise the Download section
		var $download = $("#download");
		if ($download.length > 0) {
			getHtml("/sections/download.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#download").html();
				$download.html(html);
			});
		}

		// Initialise the Testimonials section
		var $recommendations = $("#recommendations");
		if ($recommendations.length > 0) {
			getHtml("/sections/testimonials.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#recommendations").html();
				$recommendations.html(html);
				// 
				// Initialise the Testimonials carousel
				if (jQuery.fn.owlCarousel) {
					$recommendations.find(".testimonials-carousel, .mockup-carousel").owlCarousel({
						items: 1,
						//singleItem: true,
						autoWidth: false,
						autoHeight: false,
						responsive: true,
						loop: true,
						addClassActive: true,
						slideSpeed: 300,
						paginationSpeed: 400,
						autoPlay: true,
						stopOnHover: true,
						pagination: false,
						navigation: true,
						lazyLoad: true,
						navigationText: [
							"<i class='fa fa-angle-left'></i>",
							"<i class='fa fa-angle-right'></i>"
						],
						transitionStyle: "backSlide"
					});
				}
			});
		}

		// Initialise the Contacts section
		var $contacts = $("#contacts");
		if ($contacts.length > 0) {
			getHtml("/sections/contacts.min.html?v="+version, function(data) {
				var $el = $('<div/>').html(data), html = $el.find("#contacts").html();
				$contacts.html(html);
			});
		}
	}
	function initSmoothPageScrolling() {
		// jQuery for page scrolling feature - requires jQuery Easing plugin
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: ($($anchor.attr('href')).offset().top - 50)
			}, 1250, 'easeInOutExpo');
			event.preventDefault();
		});
	}
	function initSmoothScrollReveals() {
		// Initialize and Configure Scroll Reveal Animation
		if (typeof(ScrollReveal)!='undefined') {
			window.sr = ScrollReveal();
			sr.reveal('.sr-icons', { duration: 600, scale: 0.3, distance: '0px' }, 200);
			sr.reveal('.sr-button', { duration: 1000, delay: 200 });
			sr.reveal('.sr-contact', { duration: 600, scale: 0.3, distance: '0px' }, 300);
		}
	}
	function initMagnificPopupLightbox() {
		// Initialize and Configure Magnific Popup Lightbox Plugin
		if (jQuery.fn.magnificPopup) {
			$('.popup-gallery').magnificPopup({
				delegate: 'a',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				}
			});
		}
	}
	function onGooglePlatformLoad() {
		gapi.signin2.render('my-signin2', {
			'scope': 'profile email',
			'width': 240,
			'height': 50,
			'longtitle': true,
			'theme': 'dark',
			'onsuccess': function(googleUser) {
				var profile = googleUser.getBasicProfile(), name = profile.getName(), email = profile.getEmail(), id = profile.getId(), imageUrl = profile.getImageUrl();
				log('- signed-in as \''+ name +'\' (\''+ email +'\') (\''+ id +'\') (image:\''+ imageUrl +'\')');
			},
			'onfailure': function(error) {
				log(error);
			}
		});
		// 
		function signOut() {
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(function() {
				log('- signed-out');
			});
		}
		$('.my-signout2').on('click', signOut);
	}
	// On DOM Load
	window.onGooglePlatformLoad = onGooglePlatformLoad;

	// On DOM Load
	$(function() {
		initPageDynamicContentSections();
	});

	// On Window Load
	$(window).on('load', function() {
		initSmoothPageScrolling();
		initSmoothScrollReveals();
		initMagnificPopupLightbox();
	});
})(jQuery); // End of use strict
