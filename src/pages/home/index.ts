import {Router} from "@vaadin/router";
class Homepage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        this.innerHTML = `
        <div class="home-container">
            <custom-text tag="h1" variant="title">Piedra <br>Papel <custom-text class="o">ó</custom-text></br> Tijera!</custom-text>
            <div class="buttons-container">
                <custom-button class="button" id="signup"><custom-text tag="p" variant="button">Registrarse</custom-text></custom-button>
                <custom-button class="button" id="login"><custom-text tag="p" variant="button">Iniciar Sesión</custom-text></custom-button>
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
            .move-container {
                display: flex;
                gap: 45px;
            }
            .buttons-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 45px;
            }
        `;
        this.appendChild(style);
        const signupButton:HTMLButtonElement = this.querySelector("#signup")!;
        const loginButton:HTMLButtonElement = this.querySelector("#login")!;
        signupButton.addEventListener("click", ()=>{
            Router.go("/signup")
        });
        loginButton.addEventListener("click", ()=>{
            Router.go("/login")
        });
    }
};

customElements.define("home-page", Homepage);