/**
 * Enable smooth scrolling for all internal links.
 */
$(function () {

    // Allways scroll smooth on internal anchors
    $('a[href^="#"]').on('click',function (e) {

        e.preventDefault();

        if ('' === this.hash) {
            return true;
        }

        var target = this.hash;
        var top    = 0;

        if ('#top' !== this.hash) {
            top = $('a[name=' + this.hash.replace(/^#/i, '') + ']').offset().top;
        } else {
            target = '';
        }

        $('html, body').stop().animate({
            'scrollTop': top
        }, 400, 'swing', function () {
            window.location.hash = target;
        });
    });

    // Autostart carousels
    $('.carousel').carousel({
        interval: 5000
    });
});

