(function($) {
    "use strict"; // Start of use strict

    if (typeof(jQuery)=='undefined' || !jQuery.fn) {if(window.console&&window.console.log)window.console.log('jQuery is not included! Skipping template init!');return;}

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    if (jQuery.fn.scrollspy) {
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        });
    }

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
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

    // Initialize and Configure Scroll Reveal Animation
    if (typeof(ScrollReveal)!='undefined') {
        window.sr = ScrollReveal();
        sr.reveal('.sr-icons', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 200);
        sr.reveal('.sr-button', {
            duration: 1000,
            delay: 200
        });
        sr.reveal('.sr-contact', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 300);
    }

    // Initialise the Testimonials carousel
    if (jQuery.fn.owlCarousel) {
            $(".testimonials-carousel, .mockup-carousel").owlCarousel({
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

})(jQuery); // End of use strict
