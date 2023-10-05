import { state } from "../../state";
import {Router} from "@vaadin/router";
class SeekRoomPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        const currentState = state.getState();
        this.innerHTML = `
        <div class="home-container">
            <custom-text tag="h1" variant="title">Piedra <br>Papel <custom-text class="o">ó</custom-text></br> Tijera!</custom-text>
            <custom-text class="hola" tag="p" variant="p">¡Hola ${currentState.userData.name}!</custom-text>
                <div class="label-container">
                    <input class="input" type="text" placeholder="CÓDIGO" name="mail">
                    <p class="error-message" style="color: red; font-size: 25px; margin: 0;"></p>
                    <custom-button class="button" id="join-room"><custom-text tag="p" variant="button">Ingresar a la Sala</custom-text></custom-button>
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
                justify-content: center;
                align-items: center;
                gap: 8px;
                width: 100%;
            }
            .input {
                border: solid 4px rgba(185, 185, 185, 1);
                border-radius: 4px;
                color: #000;
                padding: 20px;
                width: 410px;
                font-family: 'Roboto Mono', monospace;
                font-size: 30px;
                font-weight: 500;
                text-align: center;
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
        const joinRoomEl:HTMLButtonElement = document.querySelector("#join-room")!;
        const roomIdEl:HTMLInputElement = document.querySelector(".input")!;
        const errorMessageEl:HTMLParagraphElement = this.querySelector(".error-message")!;
        joinRoomEl.addEventListener("click", async ()=>{
            const requiredRoom = await state.getRoom(roomIdEl.value);
            if(requiredRoom) {
                const joiningSuccess = await state.joinRoom(roomIdEl.value);
                if(joiningSuccess == 403) {
                    errorMessageEl.textContent = `La sala con id '${roomIdEl.value}' está completa.`;
                } else if(joiningSuccess) {
                    Router.go("/room")
                }
            } else {
                errorMessageEl.textContent = `La sala con id '${roomIdEl.value}' no existe.`;
            }
        });
    }
};

customElements.define("seekroom-page", SeekRoomPage);