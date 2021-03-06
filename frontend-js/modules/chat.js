export default class Chat {
    constructor() {
        this.openedYet = false;
        this.chatWrapper = document.querySelector("#chat-wrapper");
        this.openIcon = document.querySelector(".header-chat-icon");
        this.injectHTML();
        // if we want to close the chat window we need to put it after injectHTML
        // because the close icon doesn't exist yet
        this.closeIcon = document.querySelector(".chat-title-bar-close");
        this.events();
    }

    // events
    events() {
        this.openIcon.addEventListener("click", () => this.showChat());
        this.closeIcon.addEventListener("click", () => this.hideChat());
    }

    //methods
    injectHTML() {
        this.chatWrapper.innerHTML = `
        <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
        <div id="chat" class="chat-log"></div>

        <form id="chatForm" class="chat-form border-top">
            <input type="text" class="chat-field" id="chatField" placeholder="Type a message..." autocomplete="off">
        </form>
        `
    }

    showChat() {
        if (!this.openedYet) {
            this.openConnection()
        }
        this.openedYet = true;
        this.chatWrapper.classList.add("chat--visible");
    }

    hideChat() {
        this.chatWrapper.classList.remove("chat--visible")
    }

    openConnection() {
        this.socket = io();
    }
}