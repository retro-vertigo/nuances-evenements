import { gsap } from "gsap";
import * as ScrollMagic from 'scrollmagic';

export default class AScrollHorizontal {

    constructor(el) {
        this.el = el;  

        // ∆∆∆∆∆
        return;


        var controller = new ScrollMagic.Controller();

        var tl = gsap.timeline();

        var elementWidth = document.getElementById('js-list-values').offsetWidth;

        var width = window.innerWidth - elementWidth;

        var duration = elementWidth / window.innerHeight * 100;

        var official = duration + '%';


        // console.log('elementWidth', elementWidth);
        
        tl.to("#js-list-values", {duration: 5, x: width, ease: "none"});

        var scene1 = new ScrollMagic.Scene({
            triggerElement: '#js-list-values',
            triggerHook: 0,
            duration: official,
            // duration: 100, // the scene should last for a scroll distance of 100px
            // offset: 50, // start this scene after scrolling for 50px
        })
        .setPin('#js-list-values')
        .setTween(tl)
        .addTo(controller);

            // .setPin('#my-sticky-element') // pins the element for the the scene's duration
            // .setTween("#my-sticky-element", {borderTop: "30px solid white", backgroundColor: "blue", scale: 0.7}) // the tween durtion can be omitted and defaults to 1
            // .addTo(controller); // assign the scene to the controller
                
        this.init();
    }

    init() {
        
    }

    
    
}
