import '../vendors/slick.min';

export default class SliderSlick {

    constructor(el) {
        this.block = el;
        this.$block = $(this.block);      // jQuery selector for block
        
        this.init();
    }

    init () {
        let slider   = this.$block.find('.slider-slick');
        let slide    = this.$block.find('.slide-slick');

        let sliderSettings = {
            slide        : '.slide-slick',
            rows         : 0,                                        // fix bug to make slide param works (https://stackoverflow.com/questions/30036742/jquery-slick-carousel-slide-setting)
            arrows       : true,
            prevArrow    : this.$block.find('.btn-slick.-prev'),
            nextArrow    : this.$block.find('.btn-slick.-next'),
            dots         : true,
            appendDots    : this.$block.find('.slider-dots'),
            infinite      : false,
            speed        : 500,
            cssEase      : 'ease-in-out',
            slidesToShow  : 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 940,
                    settings  : {
                        slidesToShow  : 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 768,
                    settings  : {
                        speed         : 250,
                        cssEase       : 'ease-out',
                        touchThreshold: 12,
                        slidesToShow  : 2,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 576,
                    settings  : {
                        speed         : 250,
                        cssEase       : 'ease-out',
                        touchThreshold: 12,
                        centerMode    : true,
                        centerPadding : '10%',
                        slidesToShow  : 1,
                        slidesToScroll: 1,
                    }
                }
            ],
        };

        if ($(slide).length  > 1) {
            $(slider).slick(sliderSettings);
        }
    }


    
}
