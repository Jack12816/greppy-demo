/**
 * Mock console.log to prevent errors.
 */
try {
    var c = console;
} catch (e) {
    console = {};
    console.log = function() {};
    console.debug = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.dir = function() {};
}

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
        interval: 7000
    }).carousel('cycle');

    // Autostart tooltips
    $('*[data-toggle=tooltip]').tooltip();

    // Dev notes
    console.log([
        "   ______",
        "  / ____/_______  ____  ____  __  __",
        " / / __/ ___/ _ \\/ __ \\/ __ \\/ / / /",
        "/ /_/ / /  /  __/ /_/ / /_/ / /_/ /",
        "\\____/_/   \\___/ .___/ .___/\\__, /",
        "              /_/   /_/    /____/",
        "Hey ho!", "",
        "Interessted in learning more about Greppy? Check out the code behind this ",
        "application. Maybe you could improve some code, implement new features and ",
        "become a core developer!", "",
        "Contact us and stay tuned!",
        "The Greppy Gang"
    ].join('\n'));
});

