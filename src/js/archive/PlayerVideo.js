
export default class PlayerVideo {

    constructor(el) {
        this.block = el;
        this.btnPlay = this.block.querySelector('[data-btn-play-video]');
        this.player = this.block.querySelector('iframe');

        if (this.block && this.btnPlay) this.init();
    }

    init() {
        this.btnPlay.addEventListener('click', e => this.startVideo(e) );
    }


    // Play video on btn click
    startVideo(e) {
        
        this.btnPlay.classList.add('is-hidden');

        // post our command to the iframe.
        if (this.player != undefined) {
            let command = {
                "event": "command",
                "func" : "playVideo"
            };
            this.player.contentWindow.postMessage(JSON.stringify(command), "*");
        }
    }
}
