customElements.define(
    "custom-back-button",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            this.shadow.innerHTML = `
                <button class="button"></button>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .button {
                    background: #fefefe;
                    border: solid 4px rgba(185, 185, 185, 1);
                    border-radius: 4px;
                    color: #ccc;
                    padding: 15px;
                    font-sixe: 45px;
                    min-width: 410px;
                }
            `;
            this.shadow.appendChild(style);
            const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
            buttonEl.innerHTML = this.innerHTML;
        };
    }
);