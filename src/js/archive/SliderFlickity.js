// *** import if no add-ons needed
import Flickity from '../vendors/flickity.pkgd.min.js'

// *** import if add-ons with npm packages
// import Flickity from 'flickity-fade'
// import 'flickity-hash'

// *** import if add-ons with paths
// import Flickity from '../vendors/flickity-fade.js'
// import '../vendors/flickity-hash.js'


export default class SliderFlickity {

    constructor(el) {
        this.block    = el;
        this.slider   = this.block.querySelector('.slider-flickity');
        this.btnPrev  = this.block.querySelector('.btn-flickity.--prev');
        this.btnNext  = this.block.querySelector('.btn-flickity.--next');
        this.controls = this.block.querySelector('.slider-flickity-controls');
        this.counter  = this.block.querySelector('.slider-counter');

        // current slide / last slide
        this.currentIndex;
        this.lastIndex;
        this.currentSlide;
        this.lastSlide;
        
        // custom autoplay
        this.progressBar   = this.block.querySelector('.progress-flickity__bar');
        this.autoPlay      = true;
        this.isPaused      = false;
        this.duration      = 4000;
        this.intervalDelay = 10;
        this.step          = this.duration / this.intervalDelay;

        this.percentTime = 0;
        this.timerID;

        // ∆∆∆∆∆∆∆∆∆∆∆∆∆
        this.autoPlay      = false;
        // ∆∆∆∆∆∆∆∆∆∆∆∆∆

        this.init();
    }

    init () {
        // prevent FOUC on load
        this.slider.offsetHeight;      // trigger redraw for transition

        // set initial focus so that carousel can be keyboard navigated on initial page load
        // this.slider.focus();

        // ***** options *****
        let options = {
            // prevNextButtons: false,
            // pageDots: false
            // cellAlign: 'left',
            // contain: true,
            // freeScroll: true,
            // wrapAround: false,
            
            // selectedAttraction: 0.01,
            // friction: 0.1

            // groupCells: true,    // if set to true group cells that fit in carousel viewport

            // watchCSS: true     // enable Flickity in CSS when element:after { content: 'flickity' }
            // dragThreshold: 30      // dragging doesn't start until 30px moved

            // imagesLoaded: true,      //  re-positions cells once their images have loaded (no need when aspect-ratio cell)
            // lazyLoad: 2         // load images in selected slide and next / previous 2 slides

            // initialIndex: 2

            // fade: true,
            // hash: true

            // ready events on options
            // on: {
            //     ready: () => {  console.log('Flickity ready');  }
            // }
        }
        // disable dots below 1024px
        // if ( matchMedia('screen and (max-width: 1024px)').matches ) {
        //     options.pageDots = false;
        // }
        this.flkty = new Flickity(this.slider, options);
        return;


        // ***** API *****
        this.currentIndex = this.flkty.selectedIndex;
        this.lastIndex    = this.currentIndex;
        this.currentSlide = this.flkty.selectedElement;
        this.lastSlide    = this.currentSlide;
        
        this.flkty.on( 'change', ( index ) => {
            this.onChange(index);
        });

        // stop autoPlay when dragging
        this.flkty.on( 'dragStart', ( index ) => {
            if(this.autoPlay) this.resetProgressBar();
        });

        // restart autoplay when current slide is settled
        this.flkty.on( 'settle', ( index ) => {
            if(this.autoPlay) this.startProgressBar();
            
            // autoPlay slide video
            if(this.currentSlide.classList.contains('-is-video')) this.playPlayerVideo();
        });

        // Select slide on click
        this.flkty.on( 'staticClick', ( event, pointer, cellElement, cellIndex ) => {
            if ( typeof cellIndex == 'number' && cellIndex != this.flkty.selectedIndex) {
              this.flkty.selectCell( cellIndex );
            }
        });

        // custom prev / next button
        this.initControls();

        // update current slide number in status
        this.updateCountStatus();

        // init custom progress bar for autoPlay
        if(this.autoPlay) this.initAutoPlay();

        // update draggable options
        window.addEventListener('resize', e => this.resizeWindow());
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
        
        // update current slide number in status
        this.updateCountStatus();
        
        // stop autoPlay
        if(this.autoPlay) this.resetProgressBar();
        this.pausePlayerVideo();

        this.updateControls();
    }


    // Slide video with player YouTube 
    // -----------------------------------------------

    // autoPlay video when slide is settled
    playPlayerVideo() {
        const player = this.currentSlide.querySelector('iframe');
        if (player) this.postYouTubeCommand(player, 'playVideo')
    }

    
    // pause all video when slide change
    pausePlayerVideo() {
        this.flkty.cells.forEach(  el => {
            const player = el.element.querySelector('iframe');
            if (player) this.postYouTubeCommand(player, 'pauseVideo');
        });
    }

    // post our command to the iframe.
    postYouTubeCommand(player, func) {
        if (player != undefined) {
            const command = {
                "event": "command",
                "func": func
            };
            player.contentWindow.postMessage(JSON.stringify(command), "*");
        }
    }



    // Custom autoPlay with progress bar
    // -----------------------------------------------

    // init custom progress bar for autoPlay
    initAutoPlay() {
        // pause / play autoplay when mouse hover
        // this.block.addEventListener('mouseenter', e => {   this.isPaused = true;   });
        // this.block.addEventListener('mouseleave', e => {   this.isPaused = false;  });
        
        this.startProgressBar();
    }

    startProgressBar() {
        if(this.flkty.selectedIndex < this.flkty.slides.length-1) {
            this.progressBar.style.removeProperty('transition');
            this.percentTime = 0;
            this.isPaused = false;
            this.timerID = setInterval(() => this.increaseProgressBar(), this.intervalDelay);
        }
    };
    
    increaseProgressBar() {
        if (!this.isPaused) {
            this.percentTime += 100 / this.step;
            // console.log('this.percentTime', this.percentTime);
            this.progressBar.style.width = this.percentTime + "%";
            if (this.percentTime >= 100) {
                this.flkty.next();
            }
        }
    }

    resetProgressBar() {
        this.progressBar.style.width = 0 + '%';
        this.progressBar.style.transition = 'width 0.25s';
        clearTimeout(this.timerID);
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
        // if (this.flkty.slides.length == 1) {
        //     this.controls.classList.add('-is-hidden');
        // } else {
        //     this.controls.classList.remove('-is-hidden');
        // }

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


    // update current slide number in status
    updateCountStatus() {
        const slideNumber = this.flkty.selectedIndex + 1;
        this.counter.textContent = slideNumber + '/' + this.flkty.slides.length;
    }


    // update draggable options
    resizeWindow() {
        // console.log('draggable', this.flkty.options.draggable);

        if (window.innerWidth < 1024) {
            if (this.flkty.options.draggable != false) {
                this.flkty.options.draggable = false;
                this.flkty.updateDraggable();
            }
        } else {
            if (this.flkty.options.draggable == false) {
                this.flkty.options.draggable = '>1';
                this.flkty.updateDraggable();
            }
        }
    }


    
}
