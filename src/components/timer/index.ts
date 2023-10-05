customElements.define(
    "custom-timer",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const divEl = document.createElement("div");
            divEl.className = "container";
            this.shadow.appendChild(divEl);
            const style = document.createElement("style");
            style.innerHTML = `
                .container {
                    width: 250px;
                    height: 250px;
                    background: none;
                    border-radius: 50%;
                    border: 23px solid #000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 100px;
                    font-weight: 700;
                    margin-top: 100px;
                }
            `;
            this.shadow.appendChild(style);
            let counter:any = 3;
            const intervalo = setInterval(()=>{
                if(counter == 1) {
                    counter = "Ya!";
                    clearInterval(intervalo);
                    divEl.textContent = `${counter}`;
                } else {
                    counter--;
                    divEl.textContent = `${counter}`;
                }
            },1000);
            divEl.textContent = counter
        };
    }
);