import { state } from "../../state";
import {Router} from "@vaadin/router";
class LobbyPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        const currentState = state.getState();
        this.innerHTML = `
        <div class="home-container">
            <custom-text tag="h1" variant="title">Piedra <br>Papel <custom-text class="o">ó</custom-text></br> Tijera!</custom-text>
            <custom-text class="hola" tag="p" variant="p">¡Hola ${currentState.userData.name}!</custom-text>
            <div class="buttons-container">
                <custom-button class="button" id="new-game"><custom-text tag="p" variant="button">Nuevo Juego</custom-text></custom-button>
                <custom-button class="button" id="room"><custom-text tag="p" variant="button">Ingresar a una sala</custom-text></custom-button>
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
            .buttons-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 45px;
            }
            .hola {
                margin: -20px 0 20px 0;
            }
            .move-container {
                display: flex;
                gap: 45px;
                margin-top: 50px;
            }
            .form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                gap: 20px;
            }
            .label-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
            }
            .input {
                border: solid 4px rgba(185, 185, 185, 1);
                border-radius: 4px;
                color: #000;
                padding: 15px 0 15px 8px;
                width: 100%;
                font-family: 'Roboto Mono', monospace;
                font-size: 20px;
                font-weight: 500;
            }
            .input::selection {
                background-color: rgba(0, 144, 72, 1);
                color: #fff;
            }
            .input:focus {
                border-color: rgba(0, 144, 72, 1);
                outline: none;
            }
        `;
        this.appendChild(style);
        const newGameEl:HTMLButtonElement = document.querySelector("#new-game")!;
        const roomEl:HTMLButtonElement = document.querySelector("#room")!;
        newGameEl.addEventListener("click", async ()=>{
            await state.createRoom();
            Router.go("/room")
        });
        roomEl.addEventListener("click", ()=>{
            Router.go("/seek-room")
        });
    }
};

customElements.define("lobby-page", LobbyPage);