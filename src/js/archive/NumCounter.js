import { CountUp } from "../vendors/countUp.min";
import { isInViewport } from "../utils/utilsLib";

export default class NumCounter {

    constructor(el) {
        this.block    = el;
        this.items = this.block.querySelectorAll('[data-start-num]');
        this.detectInViewport = this.detectInViewport.bind(this);       // TODO

        this.init();
    }

    init () {
        window.addEventListener('scroll', this.detectInViewport);
    }

    // Detect if items are in viewport and launch counter
    detectInViewport(e) {
        if(isInViewport(this.block.querySelector('.block-keyfigures__items'))) {
            window.removeEventListener('scroll', this.detectInViewport);
            
            const options = {
                duration: 4,
                useGrouping: false
            }
            
            this.items.forEach( el => {
                let countUp = new CountUp(el, el.dataset.endNum, options);
                countUp.start();
             });
        }
    }

}
