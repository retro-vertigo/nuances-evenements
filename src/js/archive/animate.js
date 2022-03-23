class Animate {

    constructor() {
    }

    init () {

    }

    start () {
        $(window).on('scroll resize', this.update );
        setTimeout(this.update, 100);
    }

    update() {
        // console.log('update')
        var windowHeight            = $(window).height(),
            windowTopPosition       = $(window).scrollTop(),
            windowBottomPosition    = (windowTopPosition + windowHeight),
            activeDelay             = 0.05,
            autoreverse             = false,
            elToCheck               = $('.animate');
        //
        $.each(elToCheck, function() {
            var el                  = $(this),
                elHeight            = el.outerHeight(),
                elTopPosition       = el.offset().top,
                elBottomPosition    = (elTopPosition + elHeight);

            if ( elTopPosition <= windowBottomPosition - windowHeight * activeDelay
                && !el.hasClass('animate--reveal') ) {
                el.addClass('animate--reveal');
            } else if ( autoreverse ) {
                el.removeClass('animate--reveal');
            }
        });
    }

}

export default new Animate