import {state} from "../../state";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
customElements.define(
    "custom-score",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const scoreContainer = document.createElement("div");
            scoreContainer.classList.add("score");
            const style = document.createElement("style");
            style.textContent = `
                .score {
                    border: 10px solid #000000;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px;
                }
                .text-container {
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    align-self: end;
                }
            `;
            const currentState = state.getState();
            const currentGame:[RTDBPlayer, RTDBPlayer] = currentState.rtdb;
            const currentHistory = currentState.history;
            if(currentGame) {
                const host = Object.entries(currentGame).find((player) => player[1].host === true)!;
                const guest = Object.entries(currentGame).find((player) => player[1].host == false)!;
                const hostWins = currentHistory.host;
                const guestWins = currentHistory.guest;
                const empates = currentHistory.empate;
                scoreContainer.innerHTML = `
                    <custom-text variant="score">Score</custom-text>
                    <div class="text-container">
                        <custom-text variant="score">${host[1].name}:${hostWins}</custom-text>
                        <custom-text variant="score">${guest[1].name}:${guestWins}</custom-text>
                        <custom-text variant="score">Empates:${empates}</custom-text>
                    </div>
                `;
                this.shadow.innerHTML = "";
                this.shadow.appendChild(scoreContainer);
                this.shadow.appendChild(style);
            };
        }
    }
);