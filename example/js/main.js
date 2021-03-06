/* ===================================
--------------------------------------
  SolMusic HTML Template
  Version: 1.0
--------------------------------------
======================================*/


'use strict';

var abHaze = new abHaze('bSiok3FKHXFN5cBo64029082', 'IlTpQkmytwb348SzmvZy4fEv2VIymDfx64029082', 'PRODUCTION', null);
abHaze.setAB('.ab-slider-image-1', '.ab-test-target', true);
abHaze.setAB('.ab-slider-image-2', '.ab-test-target', true);

$(window).on('load', function() {
    /*------------------
        Preloder
    --------------------*/
    $(".loader").fadeOut();
    $("#preloder").delay(400).fadeOut("slow");

    if($('.playlist-area').length > 0 ) {
        var containerEl = document.querySelector('.playlist-area');
        var mixer = mixitup(containerEl);
    }

});

(function($) {
    /*------------------
        Navigation
    --------------------*/
    $(".main-menu").slicknav({
        appendTo: '.header-section',
        allowParentLinks: true,
        closedSymbol: '<i class="fa fa-angle-right"></i>',
        openedSymbol: '<i class="fa fa-angle-down"></i>'
    });

    $('.slicknav_nav').prepend('<li class="header-right-warp"></li>');
    $('.header-right').clone().prependTo('.slicknav_nav > .header-right-warp');

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function() {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });


    $('.hero-slider').owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        mouseDrag: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        autoplay: true
    });

    $('.hero-slider').on('translated.owl.carousel', () => {
        dispatchEvent(new Event('load'));
    });

})(jQuery);

