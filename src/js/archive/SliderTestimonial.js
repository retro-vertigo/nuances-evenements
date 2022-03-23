// *** import if no add-ons needed
import Flickity from '../vendors/flickity.pkgd.min.js'


export default class SliderTestimonial {

    constructor(el) {
        this.block    = el;
        this.slider   = this.block.querySelector('.slider-testimonial');

        // current slide / last slide
        this.currentIndex;
        this.lastIndex;
        this.currentSlide;
        this.lastSlide;

        this.autoPlayDelay = 5000;

        this.init();
    }

    init () {
        // prevent FOUC on load
        this.slider.offsetHeight;      // trigger redraw for transition

        // ***** options *****
        let options = {
            prevNextButtons: false,
            wrapAround: true,
            selectedAttraction: 0.01,
            friction: 0.18
        }
        // prevent autoplay on admin
        if(!document.querySelector('body.wp-admin')) options.autoPlay = this.autoPlayDelay;

        this.flkty = new Flickity(this.slider, options);

        // ***** API *****
        this.currentIndex = this.flkty.selectedIndex;
        this.lastIndex    = this.currentIndex;
        this.currentSlide = this.flkty.selectedElement;
        this.lastSlide    = this.currentSlide;
        
        this.flkty.on( 'change', ( index ) => {
            this.onChange(index);
        });

        // PATCH iOS 15 horizontal drag bug
        // https://github.com/metafizzy/flickity/issues/1177
        this.flkty.on('dragStart', () => (document.ontouchmove = () => false));
        this.flkty.on('dragEnd', () => (document.ontouchmove = () => true));

        // resize after delay to prevent shift after font load 
        setTimeout(() => this.flkty.resize(), 500);
    }



    // Events 
    // -----------------------------------------------

    onChange(index) {
        // update current / last index and slide
        this.lastIndex    = this.currentIndex;
        this.currentIndex = index;
        this.lastSlide    = this.currentSlide;
        this.currentSlide = this.flkty.selectedElement;
        // console.log( 'Flickity change ', this.currentIndex, '('+this.lastIndex+')' );

        // anim slide content
        this.lastSlide.classList.remove('reveal');
        this.currentSlide.classList.add('reveal');
    }
    
}
