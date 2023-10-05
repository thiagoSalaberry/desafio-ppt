import { state } from "../../state";
import {Router} from "@vaadin/router";
type Move = "Piedra" | "Papel" | "Tijera";
type Player = {
    id: string,
    data: {
        name: string,
        // email: string,
        move: Move,
        online: boolean,
        host: boolean
    }
}
type Room = {
    host: Player,
    rival: Player
}
class Probando extends HTMLElement {
    owner:object;
    rival:object;
    connectedCallback() {
        // state.initDePrueba("63149719-e111-4d6b-a7c8-cb95fcfffa39");
        // state.setState({
        //     gameroomId: "esteEsElIdDeLaRoom",
        //     shortRoomId: "123456",
        //     userData: {name: "Thiago", id: "esteEsElIdDelUsuario", email: "thiagopiola99@gmail.com"},
        //     rtdb: {
        //         esteEsElIdDelJugadorUno: {
        //             name: "Thiago",
        //             host: true,
        //             online: true,
        //             move: "piedra",
        //             ready: true
        //         },
        //         esteEsElIdDelJugadorDos: {
        //             name: "Franco",
        //             host: false,
        //             online: true,
        //             move: "tijera",
        //             ready: true
        //         },
        //     },
        //     winner: "host"
        // });
        localStorage.setItem("nombre", "Thiago");
        state.subscribe(()=>{
            this.render();
        });
        this.render();
    };
    render() {
        const currentState = state.getState();
        // const host:Player = currentState.host;
        // const rival:Player = currentState.rival;
        this.innerHTML = `
            <input class="nombre" type="text" placeholder="Nombre"/>
            <input class="apellido" type="text" placeholder="Apellido"/>
            <input class="dni" type="number" placeholder="DNI"/>
            <custom-back-button><custom-text tag="p" variant="back">Limpiar State</custom-text></custom-back-button>
            <button><custom-text tag="p" variant="back">Mostrar</custom-text></button>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            .players-data {
                display:flex;
                justify-content: space-evenly;
            }
            .one, .two {
                background-color: #eee;
                padding: 50px;
            }
            p {
                font-size: 40px;
            }
            h2 {
                font-size: 60px;
            }
            .move-container {
                display:flex;
                justify-content: space-evenly;
            }
        `;
        const nameEl:HTMLInputElement = this.querySelector(".nombre")!;
        const apellido:HTMLInputElement = this.querySelector(".apellido")!;
        const dniEl:HTMLInputElement = this.querySelector(".dni")!;
        const clearStateEl:HTMLButtonElement = this.querySelector("custom-back-button")!;
        const mostrarEl:HTMLButtonElement = this.querySelector("button")!;
        const userData = currentState.userData
        clearStateEl.addEventListener("click", ()=>{
            const newState = {
                nombre: nameEl.value,
                apellido: apellido.value,
                dni: dniEl.value
            }
            state.setState(newState);
            localStorage.setItem("currentState",JSON.stringify(newState));
        });
        mostrarEl.addEventListener("click", ()=>{
            console.log("Este es el localStorage", localStorage.getItem("currentState"));
        })
        this.appendChild(style);
    }
};

customElements.define("probando-page", Probando);