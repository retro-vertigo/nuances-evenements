// *** import if no add-ons needed
import Flickity from '../vendors/flickity.pkgd.min.js'


export default class SliderMetiers {

    constructor(el) {
        this.block    = el;
        this.slider   = this.block.querySelector('.slider-metiers');
        this.btnPrev = this.block.querySelector('.btn-flickity.--prev');
        this.btnNext = this.block.querySelector('.btn-flickity.--next');

        // current slide / last slide
        this.currentIndex;
        this.lastIndex;
        this.currentSlide;
        this.lastSlide;

        this.init();
    }

    init () {
        // prevent FOUC on load
        this.slider.offsetHeight;      // trigger redraw for transition

        // ***** options *****
        let options = {
            prevNextButtons: false,
            pageDots: false,
            cellAlign: 'left',
            // selectedAttraction: 0.01,
            // friction: 0.18
            // contain: true,
        }
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

        // PATCH iOS 15 horizontal drag bug
        // https://github.com/metafizzy/flickity/issues/1177
        this.flkty.on('dragStart', () => (document.ontouchmove = () => false));
        this.flkty.on('dragEnd', () => (document.ontouchmove = () => true));
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

        this.updateControls();
    }


    // Custom controls
    // -----------------------------------------------

    // set custom prev / next buttons
    initControls() {
        this.btnPrev.addEventListener('click', e => {
            if(this.flkty.selectedIndex > 0) this.flkty.previous();
        });
        this.btnNext.addEventListener('click', e => {
            if(this.flkty.selectedIndex < this.flkty.slides.length-1) this.flkty.next();
        });
    }

    // disable / enable buttons 
    updateControls() {
        if(this.flkty.selectedIndex == 0) {
            this.btnPrev.setAttribute('disabled', true);
            this.btnNext.removeAttribute('disabled');       // <-- remove disabled from the next
        } else if(this.flkty.selectedIndex == this.flkty.slides.length-1) {
            this.btnNext.setAttribute('disabled', true);
            this.btnPrev.removeAttribute('disabled');       // <-- remove disabled from the prev
        } else {
            this.btnPrev.removeAttribute('disabled');
            this.btnNext.removeAttribute('disabled');
        }
    }

}
