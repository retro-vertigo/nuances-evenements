// *** import if no add-ons needed
// import Flickity from '../vendors/flickity.pkgd.min.js'

// // *** import if add-ons with npm packages
// import Flickity from 'flickity-fade'

// *** import if add-ons with paths
import Flickity from '../vendors/flickity-fade.js'


export default class SliderHome {

    constructor(el) {
        this.block   = el;
        this.slider  = this.block.querySelector('.slider-home');
        this.btnPrev = this.block.querySelector('.btn-flickity.--prev');
        this.btnNext = this.block.querySelector('.btn-flickity.--next');
        this.btnCta  = this.block.querySelectorAll('.slide-home .btn');

        // current slide / last slide
        this.currentIndex;
        this.lastIndex;
        this.currentSlide;
        this.lastSlide;
        
        // options passed in html mark-up
        this.autoPlayDelay = (this.slider.dataset.autoplay) ? parseInt(this.slider.dataset.autoplay) : false;

        this.init();
    }

    init () {
        // prevent FOUC on load
        this.slider.offsetHeight;      // trigger redraw for transition

        // ***** options *****
        let options = {
            prevNextButtons: false,
            wrapAround: true,
            pageDots: false,
            fade: true,
            draggable: false,
            pauseAutoPlayOnHover: false,
            setGallerySize: false
            // selectedAttraction: 0.01,
            // friction: 0.18

            // imagesLoaded: true,      //  re-positions cells once their images have loaded (no need when aspect-ratio cell)
            // lazyLoad: 2         // load images in selected slide and next / previous 2 slides
        }
        // prevent autoplay on admin
        if(!document.querySelector('body.wp-admin') && this.autoPlayDelay) options.autoPlay = this.autoPlayDelay;

        this.flkty = new Flickity(this.slider, options);

        // ***** API *****
        this.currentIndex = this.flkty.selectedIndex;
        this.lastIndex    = this.currentIndex;
        this.currentSlide = this.flkty.selectedElement;
        this.lastSlide    = this.currentSlide;
        
        this.flkty.on( 'change', ( index ) => {
            this.onChange(index);
        });

        // custom prev / next button
        this.initControls();
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


    // Custom controls
    // -----------------------------------------------

    // set custom prev / next buttons
    initControls() {
        this.btnPrev.addEventListener('click', e => {
            this.flkty.previous();
        });
        this.btnNext.addEventListener('click', e => {
            this.flkty.next();
        });

        // pause autoplay when hover btn cta on each slide
        this.btnCta.forEach( el => {
            el.addEventListener('mouseover', e => {
                this.flkty.pausePlayer();
            });
            el.addEventListener('mouseout', e => {
                this.flkty.unpausePlayer();
            });
        });
        this.btnPrev.addEventListener('mouseover', e => {
            this.flkty.pausePlayer();
        });
        this.btnPrev.addEventListener('mouseout', e => {
            this.flkty.unpausePlayer();
        });
        this.btnNext.addEventListener('mouseover', e => {
            this.flkty.pausePlayer();
        });
        this.btnNext.addEventListener('mouseout', e => {
            this.flkty.unpausePlayer();
        });
    }
    
}
