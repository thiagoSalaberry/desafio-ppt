const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
import { rtdb } from "./rtdb";

type Gameroom = {
    id:string,
    shortRoomId:string,
    players:[Player, Player],
    history: GamesHistory
    currentGame: Game
};

type Player = {
    id:string,
    name:string,
    email:string
};

type Game = {
    ownerId: {        
        name:string,
        owner:true
        online:boolean
        move:Move
        ready:boolean
    },
    guestId: {        
        name:string,
        owner:false,
        online:boolean
        move:Move
        ready:boolean
    },
    ready:boolean
};

type GamesHistory = {
    ownerWins: number,
    guestWins: number,
    draws: number,
};

type Move = "piedra" | "papel" | "tijera";

const map = {
    piedra: 1,
    tijera: 2,
    papel: 3,
};
const resultados = {
    host: [-1, 2],
    empate: [0],
    guest: [-2, 1],
};

const state = {
    data: {},
    listeners: [], 
    getState() {
        return this.data;
    },
    setState(newState) {
        this.data = newState;
        this.listeners.forEach(listener => listener());
        console.log(`Soy el state de ${location.pathname}`, newState);
    },
    subscribe(callback) {
        this.listeners.push(callback);
    },
    setNameAndEmail(name:string, email:string) {
        const currentState = this.getState();
        currentState.name = name;
        currentState.email = email;
        this.setState(currentState);
    },
    async singUp():Promise<boolean> {
        const currentState = this.getState();
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method:"POST",
                headers:{'Content-Type': 'application/json'},
                body : JSON.stringify({name:currentState.name, email: currentState.email})
            });
            if (response.ok){
                const promise = await response.json();
                const {id} = promise;
                const userData:Player = {
                    name: currentState.name,
                    email: currentState.email,
                    id
                }
                this.setState({userData})
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    //Esta función va a servir para iniciar sesión. Mediante el mail, va a buscar en la base de datos un doc que tenga almacenado dicho mail.
    async login(email:string):Promise<object | null> {
        try{
            const respuesta = await fetch(`${API_BASE_URL}/users/${email}`);
            if(respuesta.ok) {
                const data = await respuesta.json();  
                return data;
            } else {
                return null;  
            }
        } catch (error) {
            console.error({error:"Usuario no encontrado"});
            return null;  
        }
    },
    //Necesito que al crear el gameroom, me devuelva le shortRoomId para cargarlo en el state
    async createRoom() {
        const currentState = this.getState();
        try {
            const response = await fetch(`${API_BASE_URL}/createRoom`, {
                method:'post',
                headers:{'Content-type':'application/json'},
                body: JSON.stringify({name: currentState.userData.name, id: currentState.userData.id, email: currentState.userData.email})
            });
            if(response.status === 201) {
                const responseData = await response.json();
                const {shortRoomId} = responseData;
                const {gameroomId} = responseData;
                state.setState({
                    ...currentState,
                    gameroomId,
                    shortRoomId,
                    winner: "",
                    history: {
                        host: 0,
                        guest: 0,
                        empate: 0
                    }
                })
            };
        } catch (error) {
            console.error(error);
        }
    },
    async getRoom(shortRoomId:string):Promise<boolean> {
        try {
            const currentState = this.getState();
            const response = await fetch(`${API_BASE_URL}/gamerooms/${shortRoomId}`);
            if(response.ok) {
                const responseData = await response.json();
                currentState.gameroomId = responseData.gameroomId;
                currentState.history = responseData.history;
                currentState.shortRoomId = responseData.shortRoomId
                this.setState(currentState)
                return true
            } else {
                return false
            }
        }
        catch (error) {
            console.error(error);
            return false
        }
    },
    async joinRoom(shortRoomId:string):Promise<boolean | number> {
        try {
            const currentState = this.getState();
            const response = await fetch(`${API_BASE_URL}/joinRoom`, {
                method: "post",
                headers:{'Content-type':'application/json'},
                body: JSON.stringify({shortRoomId, userId: currentState.userData.id, userName: currentState.userData.name, userEmail: currentState.userData.email})
            });
            if(response.status == 200 || response.status == 201) {
                return true
            } else if(response.status == 403){
                return 403;
            } else {
                return false;
            }
        } catch(error) {
            console.error(error);
            return false;
        };
    },
    listenRTDB(){
        //Voy a escuchar a la rtdb mediante esta función, y voy a cargar en el state el objeto rtdb que va a tener los datos de
        //los dos participantes y los componentes los van a consumir desde ahí
        const currentState = this.getState();
        const gameroomRef = rtdb.ref(`/gamerooms/${currentState.gameroomId}/currentGame`);
        gameroomRef.on("value", (snapshot)=>{
            const value = snapshot.val();
            if(value) {
                currentState.rtdb = value;
                const currentPlayerId = currentState.userData.id;
                for(const playerId in value) {
                    if(value.hasOwnProperty(playerId)) {
                        const playerData = value[playerId]
                        if(playerId === currentPlayerId) {
                            playerData.online = true;
                        }
                    }
                }
            }
            this.setState(currentState)
        });        
    },
    async setReady() {
        const currentState = this.getState();
        const userId = currentState.userData.id;
        const gameroomId = currentState.gameroomId;
        const response = await fetch(`${API_BASE_URL}/setReady`, {
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({gameroomId, userId})
        });
        if(response.ok) {
            const gameroomRef = rtdb.ref(`/gamerooms/${gameroomId}/currentGame`);
            gameroomRef.on("value", async (snapshot)=>{
                const value = await snapshot.val();
                currentState.rtdb = value;
                this.setState(currentState);
            });
        }
    },
    async setMove(move:Move, whoId:string) {
        const currentState = this.getState();
        const {gameroomId} = currentState;
        const currentGame = currentState.rtdb;
        const response = await fetch(`${API_BASE_URL}/setMove`, {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({gameroomId, whoId, move})
        });
        if(response.ok) {
            currentGame[whoId].move = move;
            this.setState(currentState);
        }
    },
    async setWinner(hostMove, guestMove) {
        const currentState = this.getState();
        const {gameroomId} = currentState;
        const jugada = map[hostMove] - map[guestMove];
        const resultado = Object.entries(resultados).find((r) => r[1].includes(jugada))!;
        const winner = resultado[0];
        const response = await fetch(`${API_BASE_URL}/setWinner`, {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({gameroomId, winner})
        });
        if(response.ok) {
            currentState.winner = winner;
            const {history} = await response.json();
            currentState.history = history
            this.setState(currentState);
        };
    },
    async endGame() {
        const currentState = this.getState();
        const {gameroomId, rtdb} = currentState;
        const ids = Object.keys(rtdb);
        const response = await fetch(`${API_BASE_URL}/endGame`, {
               method:"POST",
               headers : {'Content-type':'application/json'} ,
               body: JSON.stringify({gameroomId, hostId: ids[0], guestId: ids[1]})
        });
        if(response.status == 200) {
            const responseData = await response.json();
            currentState.winner = responseData.winner;
            currentState.rtdb = responseData.rtdb;
            this.setState(currentState);
        };
    },
    async disconnectPlayer(gameroomId:string, playerId:string):Promise <boolean> {
        const response = await fetch(`${API_BASE_URL}/disconnectPlayer`, {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({gameroomId, playerId})
        });
        if(response.ok) {
            return true
        } else {
            return false
        }
    },
};

export {state, Game, Move};