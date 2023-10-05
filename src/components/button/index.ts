customElements.define(
    "custom-button",
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
                    background: rgba(0, 108, 252, 1);
                    border: solid 8px rgba(0, 25, 151, 1);
                    border-radius: 4px;
                    color: #000;
                    padding: 15px;
                    font-sixe: 45px;
                    min-width: 410px;
                }
                .back {
                    background: rgba(230, ,230, 230, 1);
                    border: solid 8px rgba(0, 25, 151, 1);
                }
            `;
            this.shadow.appendChild(style);
            const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
            buttonEl.innerHTML = this.innerHTML;
        };
    }
);