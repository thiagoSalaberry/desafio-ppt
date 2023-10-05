import { state } from "../../state";
import {Router} from "@vaadin/router";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
class InstruccionsPage extends HTMLElement {
    ownerScore:number = 0;
    rivalScore:number = 0;
    roomId = "Código de la sala"
    connectedCallback() {
        state.subscribe(() => {
            this.render();
        });
        this.render();
    }
    render() {
        const currentState = state.getState();
        const currentGame:[RTDBPlayer, RTDBPlayer] = currentState.rtdb;
        if(currentGame) {

        
        const host = Object.values(currentGame).find((player:RTDBPlayer) => player.host === true);
        const guest = Object.values(currentGame).find((player:RTDBPlayer) => player.host == false);
        this.roomId = currentState.shortRoomId
        this.ownerScore = currentState.history.host;
        this.rivalScore = currentState.history.guest;
        this.innerHTML = `
        <div class="home-container">
            <header class="room-header">
                <div class="players">
                    <custom-text class="player" tag="p" variant="otraP">${host? host.name : "Nombre del dueño"}: ${this.ownerScore} - ${host?.online? "Online" : "Offline"}</custom-text>
                    <custom-text class="player rival" tag="p" variant="otraP">${guest? guest.name : "Nombre del rival"}: ${this.rivalScore} - ${guest?.online? "Online" : "Offline"}</custom-text>
                </div>
                <div class="room-info">
                    <custom-text class="room" tag="p" variant="black">Sala</custom-text>
                    <custom-text class="room-id" tag="p" variant="otraP">${this.roomId}</custom-text>
                </div>
            </header>
                <custom-text class="change" tag="p" variant="black">¡Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos!</custom-text>
                <custom-button class="button" id="play"><custom-text tag="p" variant="button">¡Jugar!</custom-text></custom-button>
            <div class="move-container">
                <piedra-move size="chico" class="piedra"></piedra-move>
                <papel-move size="chico" class="papel"></papel-move>
                <tijera-move size="chico" class="tijera"></tijera-move>
            </div>
        </div>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            .home-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-direction: column;
                height: 100vh;
                padding: 0 25px;
            }
            .room-header {
                display: flex;
                justify-content: space-between;
                width: 100%;
                padding: 20px 50px;
            }
            .players {
                display: flex;
                flex-direction: column;
                align-items: start;
            }
            .room-info {
                display: flex;
                flex-direction: column;
                align-items: end;
            }
            .id-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .move-container {
                display: flex;
                gap: 45px;
                margin-top: 50px;
            }
            .rival {
                color: rgba(255, 100, 66, 1);
            }
        `;
        this.appendChild(style);
        const jugarButtonEl:HTMLButtonElement = this.querySelector(".button")!;
        jugarButtonEl.addEventListener("click", async ()=>{
            await state.setReady();
        });
        if(host?.ready && guest?.ready && location.pathname == "/instruccions") {
                Router.go("/in-game")
            }
        }
    }
};

customElements.define("instruccions-page", InstruccionsPage);