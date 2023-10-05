import { state } from "../../state";
import {Router} from "@vaadin/router";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    readonly:boolean,
}
class RoomPage extends HTMLElement {
    roomId:string;
    connectedCallback() {
        state.listenRTDB();
        state.subscribe(()=>{
            this.render();
        });
        this.render();
    };
    render() {
        const currentState = state.getState();
        const currentGame:[RTDBPlayer, RTDBPlayer] = currentState.rtdb;
        if(currentGame) {
        const history = currentState.history;
        const host = Object.values(currentGame).find((player:RTDBPlayer) => player.host === true);
        const guest = Object.values(currentGame).find((player:RTDBPlayer) => player.host == false);
        this.roomId = currentState.shortRoomId;
        if(host && guest && host.online && guest.online) {
            let counter:any = 3;
            const intervalo = setInterval(()=>{
                if(counter == 1 && location.pathname == "/room") {
                    clearInterval(intervalo);
                    Router.go("/instruccions");
                } else {
                    counter--;
                }
            },1000);
        };
        this.innerHTML = `
        <div class="home-container">
            <header class="room-header">
                <div class="players">
                    <custom-text class="player" tag="p" variant="otraP">${host? host.name : "Nombre del dueño"}: ${history.host} - ${host?.online? "Online" : "Offline"}</custom-text>
                    <custom-text class="player rival" tag="p" variant="otraP">${guest? guest.name : "Esperando rival"}: ${history.guest} - ${guest?.online? "Online" : "Offline"}</custom-text>
                </div>
                <div class="room-info">
                    <custom-text class="room" tag="p" variant="black">Sala</custom-text>
                    <custom-text class="room-id" tag="p" variant="otraP">${this.roomId}</custom-text>
                </div>
            </header>
            <div class="id-container">
                <custom-text tag="p" variant="otraP">Compartí el código:</custom-text>
                <custom-text tag="p" variant="black">${this.roomId}</custom-text>
                <custom-text tag="p" variant="otraP">Con tu contrincante</custom-text>
            </div>
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
            .rival{
                color: rgba(255, 100, 66, 1);
            }
        `;
        this.appendChild(style);
        }
    }
};

customElements.define("room-page", RoomPage);