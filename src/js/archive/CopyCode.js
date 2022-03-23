
export default class CopyCode {

    constructor(el) {
        this.block    = el;
        this.field    = this.block.querySelector('.block-copy-code__field');
        this.feedback = this.block.querySelector('.block-copy-code__feedback');
        this.btnCopy  = this.block.querySelector('.btn-copy');
        
        this.init();
    }

    init() {
        this.field.addEventListener('click', e => this.selectField(e) );
        this.btnCopy.addEventListener('click', e => this.copyField(e) );
    }


    // Select all text in field
    selectField(e) {
        this.field.select();
    }

    // Copy the field
    copyField(e) {
        this.field.select();
        this.field.setSelectionRange(0, 99999);   // For mobile devices

        let msg;
        try {  
            const success = document.execCommand('copy');
            window.getSelection().removeAllRanges();
            msg = success ? 'Texte copié !' : 'Erreur de copie';  
        } catch(err) {  
            msg = 'error' + err;
        } 

        // show confirm message
        this.feedback.innerHTML = msg;
        this.feedback.classList.add('-is-show');
    }
}
