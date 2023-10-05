import { state } from "../../state";
import {Router} from "@vaadin/router";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
class PicksPage extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        const currentState = state.getState();
        const currentGame:[RTDBPlayer, RTDBPlayer] = currentState.rtdb;
        const myId = currentState.userData.id;
        const myMove = currentGame[myId].move;
        const ids = Object.keys(currentGame)
        let idDelRival
        ids.some((id) => {
            if(id != myId && id != "winner") {
                idDelRival = id
            }
        });
        const rivalMove = currentGame[idDelRival].move;
        const host = Object.values(currentGame).find((player:RTDBPlayer) => player.host === true);
        const guest = Object.values(currentGame).find((player:RTDBPlayer) => player.host == false);
        this.innerHTML = `
            <div class="picks-container">
                <${rivalMove}-move class="${rivalMove} pc" size="grande"></${rivalMove}-move>
                <${myMove}-move class="${myMove}" size="grande"></${myMove}-move>
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
            }
        `;
        this.appendChild(style);
        let counter:any = 3;
        const intervalo = setInterval(()=>{
            if (counter == 1){
                clearInterval(intervalo);
                state.setWinner(host?.move, guest?.move);
                Router.go("/result");
            } else {
                counter--;
            }
        },1000);
    }
};

customElements.define("picks-page", PicksPage);