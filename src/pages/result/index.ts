import { state } from "../../state";
import {Router} from "@vaadin/router";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
type Move = "piedra" | "papel" | "tijera";
class ResultPage extends HTMLElement {
    winner:string = "";
    connectedCallback() {
        state.subscribe(()=>{
            this.render();
        });
        this.render();
    };
    async render() {
        this.innerHTML = `
            <div class="picks-container">
                <custom-result></custom-result>
                <custom-score class="score"></custom-score>
                <div class="button-container">
                    <custom-button class="button" id="play-again"><custom-text tag="p" variant="button">¡Volver a Jugar!</custom-text></custom-button>
                </div>
            </div>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            .picks-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 100vh;
                margin: 35px;
            }
            .button-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
        `;
        this.appendChild(style);
        const playAgainButtonEl:HTMLButtonElement = this.querySelector("#play-again")!;
        const currentState = state.getState();
        playAgainButtonEl.addEventListener("click", async ()=>{
            const disconnectPlayer = await state.disconnectPlayer(currentState.gameroomId, currentState.userData.id);
            if(disconnectPlayer) {
                Router.go("/room");
            }
        });
    }
};

customElements.define("result-page", ResultPage);

//ingreso al room - pongo jugar - elijo el movimiento - se juega la partida - se determina el ganador - 