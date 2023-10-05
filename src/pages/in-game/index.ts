import { state } from "../../state";
import {Router} from "@vaadin/router";
type RTDBPlayer = {
    host:boolean,
    move:string,
    name:string,
    online:boolean,
    ready:boolean,
}
class InGamePage extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        const currentState = state.getState();
        this.innerHTML = `
        <div class="in-game-container">
            <custom-timer>3</custom-timer>
            <div class="move-container">
                <piedra-move class="piedra" size="grande"></piedra-move>
                <papel-move class="papel" size="grande"></papel-move>
                <tijera-move class="tijera" size="grande"></tijera-move>
            </div>
        </div>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            .in-game-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-direction: column;
                height: 100vh;
            }
            .move-container {
                display: flex;
                gap: 1rem;
                position: absolute;
                bottom: -60px;
            }
        `;
        this.appendChild(style);
        const moveContainer = this.querySelector(".move-container")!;
        moveContainer.addEventListener("click", async (e:any)=>{
            const target = e.target;
            const siblings = target.parentElement.children;
            if(target.className != "move-container") {
                target.classList.add("arriba");
                Array.from(siblings).forEach((child:any) => {
                    if(child != target) {
                        child.classList.add("abajo")
                    }
                })
            }
            await state.setMove(target.className.split(" ")[0], currentState.userData.id);
        });
        let counter = 3;
        const intervalo = setInterval(()=>{
            if(counter == 0) {
                clearInterval(intervalo);
                Router.go("/picks");
            } else {
                counter--;
            }
        },1000)
    }
};

customElements.define("ingame-page", InGamePage);