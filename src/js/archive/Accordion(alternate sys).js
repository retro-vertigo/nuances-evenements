
export default class Accordion {

    constructor(el) {
        this.block = el;
        this.items = this.block.querySelectorAll('[data-accordion-item]');
        this.multiExpand = (this.block.dataset.multiExpand === 'true');     // default false
        
        this.init();
    }

    init() {
        this.items.forEach(  el => {
            el.querySelector('[data-accordion-trigger]').addEventListener('click', e => this.clickItem(e, el) );
            // replace auto value in custom property with real value for transition
            let content = el.querySelector('[data-accordion-content]'); 
            content.style.setProperty('--height-open', content.scrollHeight+'px');
        });

        // recalculate content expanded height when resize
        window.addEventListener('resize', e => this.measureContentHeight(e) );
    }


    // Recalculate content expanded height when window resize 
    // TODO wrong height when resize up 
    measureContentHeight(e) {
        this.items.forEach(  el => {
            // replace auto value in custom property with real value for transition
            let content = el.querySelector('[data-accordion-content]'); 
            content.style.setProperty('--height-open', content.scrollHeight + 'px');
            // content.style.height = content.scrollHeight + 'px';
            // content.style.setProperty('--height-open', 'auto');

            if (el.dataset.id == 0) console.log('content.scrollHeight', content.scrollHeight, content.offsetHeight);
        });
    }


    // Open / close accordion item
    clickItem(e, item) {
        e.preventDefault();

        // close item
        if (item.classList.contains('-is-active')) {
            this.closeItem(item);
        // open item    
        } else {
            // close others first
            if (!this.multiExpand) {
                this.block.querySelectorAll('[data-accordion-item].-is-active').forEach(  el => {
                    this.closeItem(el);
                });
            }
            this.openItem(item);
        }

    }
    
    // Close item
    closeItem(item) {
        item.classList.remove('-is-active');
    }

    // Open item
    openItem(item) {
            let content = item.querySelector('[data-accordion-content]'); 
            content.style.setProperty('--height-open', content.scrollHeight + 'px');
            // console.log('ya', content.scrollHeight);
            
        item.classList.add('-is-active');
    }
}




/*
    // ∆∆∆∆∆∆ requestAnimationFrame solution
    
    // close item
    closeItem(item) {
        console.log('\nclose', item.dataset.id);
        let content = item.querySelector('[data-accordion-content]'); 
        let contentH = content.scrollHeight;

        // temporarily disable all css transitions
        let elementTransition = content.style.transition;
        content.style.transition = '';
        
        // on the next frame (as soon as the previous style change has taken effect),
        // explicitly set the element's height to its current pixel height, so we 
        // aren't transitioning out of 'auto'
        requestAnimationFrame(function() {
            content.style.height = contentH + 'px';
            content.style.transition = elementTransition;
            console.log('content.style.height', content.style.height);
            
            
            // on the next frame (as soon as the previous style change has taken effect),
            // have the element transition to height: 0
            requestAnimationFrame(function() {
                content.style.height = 0 + 'px';
            });
        });
        
        item.classList.remove('-is-active');
    }

    // open item
    openItem(item) {
        console.log('\nopen', item.dataset.id);
        let content = item.querySelector('[data-accordion-content]'); 
        let contentH = content.scrollHeight;
        content.style.height = contentH + 'px';
        console.log(content.scrollHeight);
        // console.log('height / scrollHeight', item.style.height, item.scrollHeight);
        
        item.classList.add('-is-active');
        content.style.height = contentH + 'px';
    }
    */


    /*
    // ∆∆∆∆∆∆ hack solution
    // close item
    closeItem(item) {
        console.log('\nclose', item.dataset.id);
        let content = item.querySelector('[data-accordion-content]'); 
        let contentH = content.scrollHeight;
        content.style.height = contentH + 'px';
        console.log(content.scrollHeight);      // don't remove console.log !!!
        
        item.classList.remove('-is-active');
        content.style.height = 0;
    }

    // open item
    openItem(item) {
        console.log('\nopen', item.dataset.id);
        let content = item.querySelector('[data-accordion-content]'); 
        let contentH = content.scrollHeight;
        content.style.height = contentH + 'px';
        console.log(content.scrollHeight);      // don't remove console.log !!!
        // console.log('height / scrollHeight', item.style.height, item.scrollHeight);
        
        item.classList.add('-is-active');
        content.style.height = contentH + 'px';
    }
    */
