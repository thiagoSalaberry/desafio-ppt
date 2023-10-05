customElements.define(
    "custom-text",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            type Texto = "h1" | "p" ;
            type Tipo = "title" | "o" | "p" | "button" | "otraP" | "back";
            const tag = this.getAttribute("tag") as Texto;
            const variant = this.getAttribute("variant") as Tipo;
            const type = document.createElement(tag);
            const style = document.createElement("style");
            style.innerHTML = `
                .title {
                    color: rgba(0, 144, 72, 1);
                    font-weight: 700;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 80px;
                    margin: 0;
                    margin-top: 100px;
                    line-height: 70px;
                }
                .o {
                    color: rgba(145, 204, 175, 1);
                    font-weight: 700;
                    font-family: 'Roboto Mono', monospace;
                }
                .p, .otraP, .black, .back {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 40px;
                    font-weight: 500;
                    margin: 0;
                    line-height: 40px;
                    text-align: center;
                    margin: 100px 30px 0 30px;
                }
                .otraP, .black, .back {
                    margin: 0;
                }
                .black {
                    font-weight: 700;
                }
                .button{
                    margin: 0;
                    color: #FFF;
                    font-family: 'Odibee Sans', cursive;
                    font-weight: 400;
                    font-size: 45px;
                }
                .score{
                    color: #000;
                    font-family: 'Odibee Sans', cursive;
                    font-weight: 400;
                    font-size: 45px;
                }
                .label {
                    margin: 0;
                    color: #000;
                    font-family: 'Odibee Sans', cursive;
                    font-weight: 400;
                    font-size: 30px;
                }
                .back {
                    color: rgba(185, 185, 185, 1);
                }
            `;
            type.className = variant;
            type.innerHTML = this.innerHTML;
            this.shadow.appendChild(type);
            this.shadow.appendChild(style);
        };
    }
);