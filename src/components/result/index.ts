import { state } from "../../state";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
customElements.define(
    "custom-result", 
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        winner:string = "";
        url:string = "";
        constructor() {
            super();
            this.render();
            state.subscribe(()=>{
                this.render();
            })
        };
        render() {
            const currentState = state.getState();
            const currentGame:[RTDBPlayer, RTDBPlayer] = currentState.rtdb;
            this.winner = currentState.winner;
            if(currentGame) {
                const host = Object.entries(currentGame).find((player) => player[1].host === true)!;
                const guest = Object.entries(currentGame).find((player) => player[1].host == false)!;
                const hostId = host[0];
                const guestId = guest[0];
                const myId = currentState.userData.id;
                const ids = Object.keys(currentGame)
                let idDelRival
                ids.some((id) => {
                    if(id != myId) {
                        idDelRival = id
                    }
                });
                let imageURL;
                if(myId == hostId && this.winner == "host" || myId == guestId && this.winner == "guest") {
                    imageURL = require(`url:./ganaste.png`);
                } else if(myId == hostId && this.winner == "guest" || myId == guestId && this.winner == "host") {
                    imageURL = require(`url:./perdiste.png`);
                } else if(this.winner == "empate") {
                    imageURL = require(`url:./empate.png`);
                }
                this.shadow.innerHTML = `
                    <img src="${imageURL}" class="result">
                `;            
            };
        }
    }
);