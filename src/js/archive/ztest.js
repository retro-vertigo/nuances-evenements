import $ from 'jquery';
window.$ = $;
import './vendors/jquery.easing';
import './vendors/slick.min';
// import './vendors/jquery.sticky-kit';
import AOS from './vendors/aos.min';
import animate from './animate';
import nav from './nav';
import blocks from './blocks';
import tracking from './tracking';
import parallax from './utils/Parallax';
// import countdown from './countdown';

  
class Test {
    
    constructor() {
        this.init();
    }

    init () {
        console.log('%c Test', 'background: #065AA8; color: #fff; display: block; padding:2px 5px;');
        
        // init nav, sticky header...
        nav.init();

        // init tracking on external links
        tracking.init();

        // init blocks with JS (sliders...)
        blocks.init();

        // 
        // parallax.init();

        // 
        // countdown.init();
        

        //        AOS animation
        // ==============================================

        // !!! hack : delay to init AOS after Slick init
        setTimeout(function(){
            AOS.init({
                duration: 600,
                once: false,
                easing: 'ease-out-quart',
                disable: false,
            });
            }, 1000
        );
    }
   
}

var app = new Test();
