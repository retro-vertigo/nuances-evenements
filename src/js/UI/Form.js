
export default class Form {

    constructor(el) {
        this.form        = el;
        this.controls    = el.querySelectorAll('input:not([type="radio"]), textarea, select');
        this.rankings    = el.querySelectorAll('.field-ranking');
        this.ranges      = el.querySelectorAll('.field-range');
        this.radiosOther = el.querySelectorAll('input[value="gf_other_choice"]');
        
        this.init();
    }

    init() {
        this.controls.forEach( el => this.addValidationEventListner(el) );
        this.rankings.forEach( el => this.initRanking(el) );
        this.ranges.forEach( el => this.initRanges(el) );
        this.radiosOther.forEach( el => this.initRadiosOther(el) );

         // 1ere option grisée dans les select servant de label (si option vide dans GF)
         this.form.querySelectorAll('select option[value=""]').forEach( el => {
             el.setAttribute('disabled', '');
         });
    }


    //  Radio button with "Other choice" text input displayed
    // -----------------------------------------------

    initRadiosOther(el) {
        // set special class on container (.gchoice.--other class)
        const container = el.closest('.gchoice');
        if(container) {
            container.classList.add('--other');
            const input_txt = container.querySelector('input[type="text"]');
            input_txt.value = "";
            input_txt.setAttribute('placeholder', 'Votre événement...');
            console.log('input_txt', input_txt.value);
        }
    }



    //  Range custom
    // -----------------------------------------------

    initRanges(el) {
        // update track background gradient, before and after the thumb 
        const range = el.querySelector('input');
        range.addEventListener('input', () => this.updateRangeEl(range) );
        this.updateRangeEl(range);      // update with default value

        // remove <output></output> generated by plugin
        const output = el.querySelector('output');
        if(output) output.remove();

        // create text labels before and after range by getting content from description field
        const container = el.querySelector('.ginput_container');
        const desc = el.querySelector('.gfield_description');       // fake description field

        if(desc) {
            const labels =  desc.textContent.split('|');        // label-left|label-right
            if(labels.length) {
                const labelLeft = document.createElement('span');
                labelLeft.classList.add('range-help');
                labelLeft.textContent = labels[0];
                container.insertAdjacentElement('afterbegin', labelLeft); 

                if(labels.length > 1) {
                    const labelRight = document.createElement('span');
                    labelRight.classList.add('range-help');
                    labelRight.textContent = labels[1];
                    container.insertAdjacentElement('beforeend', labelRight); 
                }
            }
        }
    }
    
    valueTotalRatio(value, min, max) {
        return ((value - min) / (max - min)).toFixed(2);
    }
    
    getLinearGradientCSS(ratio, leftColor, rightColor) {
        return [
            '-webkit-gradient(',
            'linear, ',
            'left top, ',
            'right top, ',
            'color-stop(' + ratio + ', ' + leftColor + '), ',
            'color-stop(' + ratio + ', ' + rightColor + ')',
            ')'
        ].join('');
    }
    
    updateRangeEl(range) {
        const ratio = this.valueTotalRatio(range.value, range.min, range.max);
        range.style.backgroundImage = this.getLinearGradientCSS(ratio, '#12ACAC', '#FBEBCD');
    }
    


    //  Radio ranking
    // -----------------------------------------------

    initRanking(el) {
        const group = el.querySelector('.gfield_radio');

        // wrap label text in <span></span> for tooltip
        const labels = group.querySelectorAll('label');
        labels.forEach( label => {
            const text = label.innerHTML;
            label.innerHTML = "<span>" + text + "</span>";
        });
        
        // set focus events for radio buttons
        const inputs = group.querySelectorAll('input');
        inputs.forEach( input => {
            input.addEventListener('input', (e) => this.onRankFocus(input));
        });

        // detect if there is one radio button checked by default
        const firstChecked = group.querySelector('input:checked');
        if(firstChecked) this.onRankFocus(firstChecked);
    }


    // focus event on radio buttons
    onRankFocus(input) {
        const currentInputContainer = input.parentNode;        // current parent (class .gchoice)
        // console.log('\n•currentInputContainer', currentInputContainer);

        // select previous radio buttons
        let prev = currentInputContainer;
        while (prev = prev.previousElementSibling) {
            prev.querySelector('input').dataset.filled = '';
        }

        // unselect previous radio buttons
        let next = currentInputContainer;
        while (next = next.nextElementSibling) {
            delete next.querySelector('input').dataset.filled;
        }
    }


    // set focus / blur events
    addValidationEventListner(el) {

        // When focus the first time, add data-touched (once only)
        el.addEventListener('focus', (e) => {
            if (!('touched' in el.dataset)) el.dataset.touched = '';
        });


        // When unfocus, add data-filled if the input is filled (or remove)
        el.addEventListener('blur', (e) => {
            if (el.value !== '') {
                el.dataset.filled = '';
            } else if ('filled' in el.dataset) {
                delete el.dataset.filled;
            }
        });
    }

}

