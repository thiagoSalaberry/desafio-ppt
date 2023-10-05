customElements.define(
    "papel-move",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const size = this.getAttribute("size")!;
            const moveClass = this.getAttribute("class");
            const imageURL = require(`url:./papel.png`);
            this.shadow.innerHTML = `
                <img src="${imageURL}" alt="papel" class="${moveClass}">
            `;
            const paperEl = this.shadow.querySelector(".papel")!;
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
            paperEl.classList.add(size);
            paperEl.appendChild(style);
        };
    }
)