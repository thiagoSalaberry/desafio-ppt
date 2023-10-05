import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 8989;
app.use(express.static("./dist"));
app.use(express.json());
app.use(cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }));

const usersCollection = firestore.collection("users");
const gameroomsCollection = firestore.collection("gamerooms");

//CREAR USUARIO NUEVO
app.post("/users", async (req, res)=>{
    const input = req.body;
    try{
        const existingUser = await usersCollection.where("email", "==", input.email).get();
        if(!existingUser.empty){
            return res.status(400).json({error: "El correo electrónico ya está en uso"});
        };
        const newUser = usersCollection.doc();
        await newUser.create({id: newUser.id, email: input.email, name: input.name});
        res.status(201).json({
            message: `Usuario nuevo creado con id: ${newUser.id}`,
            id: newUser.id
        });
    } catch(error) {
        console.error("Error al crear el usuario:",error);
        res.status(500).send("Error al crear el usuario en Firestore");
    };
});

//ENCONTRAR USUARIO POR MAIL
app.get("/users/:email", async (req, res)=>{
    try{
        const {email} = req.params;
        const snapshot = await usersCollection.where("email", "==", email).get();
        if(snapshot.empty) {
            res.status(404).json({error:"Usuario no encontrado"});
        } else {
            const userData = snapshot.docs[0].data();
            res.json({
                userData,
            })
        };
    } catch(err) {
        console.error("Error al crear al buscar el usuario en la base de datos", err);
        res.status(500).send("Error al crear al buscar el usuario en la base de datos");
    };
});

//CREAR NUEVO GAMEROOM EN LA RTDB
app.post("/createRoom", async (req, res)=>{
    try {
        const gameroomId = uuidv4();
        const shortRoomId = Math.ceil(Math.random() * 1000000);
        const hostData = req.body;
        const players = [{host: {name: hostData.name, id: hostData.id, email: hostData.email}}];
        const history = {
            host: 0,
            guest: 0,
            empate: 0,
        };
        const newGameRoom = gameroomsCollection.doc();
        const gameRoomData = {
            gameroomId,
            shortRoomId,
            players,
            history,
        }
        await newGameRoom.create(gameRoomData);
        const newGameroomRef = rtdb.ref(`/gamerooms/${gameroomId}`);
        const newGameroomData = {
            shortRoomId,
            currentGame: {
                [hostData.id]: {
                    name: hostData.name,
                    move: "",
                    online: true,
                    host: true,
                    ready: false
                }
            },
            winner: ""
        };
        await newGameroomRef.set(newGameroomData);
        res.status(201).json({
            message: `Sala creada con Id: ${gameroomId}`,
            gameroomId,
            shortRoomId
        });
    } catch(error) {
        console.error("Error al crear la sala en la base de datos", error);
        res.status(500).send("Error al crear la sala en la base de datos");
    };
});

//CONSEGUIR UNA GAMEROOM
app.get("/gamerooms/:shortRoomId", async (req, res)=>{
    try {
        const {shortRoomId} = req.params;
        const roomSnapshot = await gameroomsCollection.where("shortRoomId","==", parseInt(shortRoomId)).get();
        if(roomSnapshot.empty) {
            res.status(404).json("La sala que estás buscando no existe");
        } else {
            const roomData = roomSnapshot.docs[0].data();
            res.status(200).json({
                gameroomId: roomData.gameroomId,
                shortRoomId,
                history: roomData.history
            });
        }
    } catch(error) {
        console.error("Error al buscar la sala en la base de datos", error);
        res.status(500).send("Error al buscar la sala en la base de datos");
    };
});

//INGRESAR A GAMEROOM EXISTENTE EN LA RTDB
app.post("/joinRoom", async (req, res)=>{   
    try{
        const {shortRoomId, userId, userName, userEmail} = req.body;
        const gameroomSnapshot = await gameroomsCollection.where("shortRoomId", "==", parseInt(shortRoomId)).get();
        //Obtenida la sala, chequeamos si el usuario ya existe en esta sala
        const gameRoomDoc = gameroomSnapshot.docs[0];
        const gameRoomData = gameRoomDoc.data();
        const players = gameRoomData.players;
        let user;
        for(const player of players) {
            if(player.host && player.host.id === userId) {
                user = player;
                break;
            } else if(player.guest && player.guest.id === userId) {
                user = player;
                break;
            };
        };
        if(user == undefined && players.length == 1) {
            //Agrego al guest e ingreso a la sala
            players.push({guest: {id: userId, name: userName, email: userEmail}});
            await gameRoomDoc.ref.update({players: gameRoomData.players});
            res.status(201).json("Eres un nuevo guest, ingresando a la sala...");
            const rtdbGameroomRef = rtdb.ref(`/gamerooms/${gameRoomData.gameroomId}`);
            await rtdbGameroomRef.update({
                [`currentGame/${userId}`]: {
                    name: userName,
                    move: "",
                    online: true,
                    host: false,
                    ready: false
                }
            });
        } else if(user == undefined && players.length == 2) {
            //La sala está completa
            res.status(403).json("La sala está completa.");
        } else if(user.host) {
            //Ingreso a la sala como host
            const rtdbGameroomRef = rtdb.ref(`/gamerooms/${gameRoomData.gameroomId}`);
            await rtdbGameroomRef.update({
                [`currentGame/${userId}`]: {
                    name: userName,
                    move: "",
                    online: true,
                    host: true,
                    ready: false
                }
            });
            res.status(200).json("Eres el host, ingresando a la sala...");
        } else if(user.guest) {
            //Ingreso a la sala como guest
            const rtdbGameroomRef = rtdb.ref(`/gamerooms/${gameRoomData.gameroomId}`);
            await rtdbGameroomRef.update({
                [`currentGame/${userId}`]: {
                    name: userName,
                    move: "",
                    online: true,
                    host: false,
                    ready: false
                }
            });
            res.status(200).json("Eres el guest, ingresando a la sala...");
        };
    } catch(error) {
        console.error("Error al unirse a la sala", error);
        res.status(500).send("Error al unirse a la sala");
    };
});

//SET READY
app.post("/setReady", async (req, res)=>{
    try {
        const {gameroomId, userId} = req.body;
        const gameroomRef = rtdb.ref(`/gamerooms/${gameroomId}/currentGame`);
        await gameroomRef.child(userId).update({
            ready: true
        });
        res.status(200).json("El jugador está listo para inicar la partida");
    } catch(error) {
        console.error("Error al setear el estado del usuario", error);
        res.status(500).send("Error al setear el estado del usuario");
    };
});

//SETEAR MOVIMIENTO
app.post("/setMove", async (req, res)=>{
    try {
        const {gameroomId} = req.body;
        const {whoId} = req.body;
        const {move} = req.body;
        const whoRef = rtdb.ref(`/gamerooms/${gameroomId}/currentGame/${whoId}`);
        await whoRef.update({move});
        res.status(200).json("Movimiento realizado correctamente");
    } catch(error) {
        console.error("Error al setear el movimiento del usuario", error);
        res.status(500).send("Error al setear el movimiento del usuario");
    };
});

//SETEAR GANADOR
app.post("/setWinner", async (req, res)=>{
    try {
        const {gameroomId, winner} = req.body;
        const gameroomRef = rtdb.ref(`/gamerooms/${gameroomId}`);
        await gameroomRef.update({
            winner
        });
        const firestoreGameroom = gameroomsCollection.where("gameroomId", "==", gameroomId).get();
        const roomDoc = (await firestoreGameroom).docs[0];
        const roomData = roomDoc.data();
        const history = roomData.history;
        history[winner]++;
        await roomDoc.ref.update({history});
        res.status(200).json({
            message: `El ganador es: ¡${winner}!`,
            history
        });
    } catch(error) {
        console.error("Error al definir al ganador", error);
        res.status(500).send("Error al definir al ganador");
    };
})

//TERMINAR PARTIDA
app.post("/endGame", async (req, res)=>{
    try {
        const {gameroomId, hostId, guestId} = req.body;
        const gameroomRef = rtdb.ref(`gamerooms/${gameroomId}`);
        const currentGameRef = rtdb.ref(`gamerooms/${gameroomId}/currentGame`);
        await currentGameRef.child(hostId).update({
                ready: false,
                move: ""
            });
        await currentGameRef.child(guestId).update({
                ready: false,
                move: ""
            });
        await gameroomRef.update({winner: ""});
        res.status(200).json({
            rtdb: currentGameRef,
            winner: ""
        });
    } catch(error) {
        console.error("Error al definir al ganador", error);
        res.status(500).send("Error al definir al ganador");
    };
})

//DESCONECTAR JUGADOR
app.post("/disconnectPlayer", async(req, res)=>{
    try {
        const {gameroomId, playerId} = req.body;
        const currentGameRef = rtdb.ref(`gamerooms/${gameroomId}/currentGame`);
        await currentGameRef.child(playerId).update({move: "", ready: false});
        res.status(200).json("El jugador se ha desconectado");
    } catch(error) {
        console.error("Error al definir al ganador", error);
        res.status(500).send("Error al desconectar al jugador");
    };
});

app.get("*", (req, res)=>{
    res.sendFile(__dirname + "/dist/index.html");
})

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
});