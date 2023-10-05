customElements.define(
    "piedra-move",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const size = this.getAttribute("size")!;
            const moveClass = this.getAttribute("class");
            const imageURL = require(`url:./piedra.png`);
            this.shadow.innerHTML = `
                <img src="${imageURL}" alt="piedra" class="${moveClass}">
            `;
            const rockEl = this.shadow.querySelector(".piedra")!;
            const style = document.createElement("style");
            style.innerHTML = `
            .${moveClass} {
                position: relative;
                transition: all 0.5s;
            }
            .chico {
                height: 125px;
            }
            .grande {
                height: 230px;
            }
            .arriba:hover {
                transform: translateY(60px);
            }
            .abajo {
                bottom: -30px;
                opacity: 0.5;
            }
            .pc {
                transform: rotate(180deg);
            }
            `;
            rockEl.classList.add(size);
            rockEl.appendChild(style);
        };
    }
)