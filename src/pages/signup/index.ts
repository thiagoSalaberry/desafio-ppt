import { state } from "../../state";
import {Router} from "@vaadin/router";
class SignupPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        this.innerHTML = `
        <div class="home-container">
            <custom-text tag="h1" variant="title">Piedra <br>Papel <custom-text class="o">ó</custom-text></br> Tijera!</custom-text>
            <custom-text tag="p" variant="p">Ingresá tus datos para poder registrarte</custom-text>
            <form id="signupform" class="form">
                <div class="label-container">
                    <custom-label><custom-text tag="p" variant="label">Nombre</custom-text></custom-label>
                    <input class="input" type="text" placeholder="Ingresá tu nombre" name="nombre" required>
                </div>
                <div class="label-container">
                    <custom-label><custom-text tag="p" variant="label">E-Mail</custom-text></custom-label>
                    <input class="input" type="text" placeholder="Ingresá tu E-Mail" name="mail" required>
                    <p class="error-message" style="color: red; font-size: 25px; margin: 0;"></p>
                </div>
                <custom-button class="button" id="signup"><custom-text tag="p" variant="button">Registrarse</custom-text></custom-button>
                </form>
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
        const singUpEl:HTMLButtonElement = this.querySelector(".button")!;
        singUpEl.addEventListener("click", async ()=>{
            const nombreInput = document.querySelector('[name="nombre"]') as HTMLInputElement;
            const mailInput = document.querySelector('[name="mail"]') as HTMLInputElement;
            const errorMessageEl:HTMLParagraphElement = document.querySelector(".error-message")!;
            if(nombreInput.value == "" || mailInput.value == "") {
                errorMessageEl.textContent = `Debes ingresar un nombre y un mail para poder registrarte.`
            } else {
                state.setNameAndEmail(nombreInput.value, mailInput.value);
                const registrationSuccess = await state.singUp();
                if(registrationSuccess) {
                    Router.go("/lobby")
                } else {
                    errorMessageEl.textContent = `El E-Mail que estás intentando ingresar corresponde a un usuario existente.`;
                }
            }
        });
    }
};

customElements.define("signup-page", SignupPage);