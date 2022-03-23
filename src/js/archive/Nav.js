import Tools from "../Tools";
import ExitIntentModal from "../UI/ExitIntentModal";
import Modal from "../UI/Modal";

class Nav {

    constructor() {
        if (document.getElementById('modal-mentions')) this.modalMentions = new Modal(document.getElementById('modal-mentions'));
        if (document.getElementById('modal-newsletter')) this.modalNewsletter = new Modal(document.getElementById('modal-newsletter'));
        if (document.getElementById('modal-exit')) this.modalExit = new ExitIntentModal(document.getElementById('modal-exit'));
    }

    init () {
        
        
    }


}

export default new Nav