"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var db_1 = require("./db");
var cors = require("cors");
var uuid_1 = require("uuid");
var app = express();
var port = process.env.PORT || 8989;
app.use(express.static("./dist"));
app.use(express.json());
app.use(cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
var usersCollection = db_1.firestore.collection("users");
var gameroomsCollection = db_1.firestore.collection("gamerooms");
//CREAR USUARIO NUEVO
app.post("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var input, existingUser, newUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, usersCollection.where("email", "==", input.email).get()];
            case 2:
                existingUser = _a.sent();
                if (!existingUser.empty) {
                    return [2 /*return*/, res.status(400).json({ error: "El correo electrónico ya está en uso" })];
                }
                ;
                newUser = usersCollection.doc();
                return [4 /*yield*/, newUser.create({ id: newUser.id, email: input.email, name: input.name })];
            case 3:
                _a.sent();
                res.status(201).json({
                    message: "Usuario nuevo creado con id: ".concat(newUser.id),
                    id: newUser.id
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Error al crear el usuario:", error_1);
                res.status(500).send("Error al crear el usuario en Firestore");
                return [3 /*break*/, 5];
            case 5:
                ;
                return [2 /*return*/];
        }
    });
}); });
//ENCONTRAR USUARIO POR MAIL
app.get("/users/:email", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, snapshot, userData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.params.email;
                return [4 /*yield*/, usersCollection.where("email", "==", email).get()];
            case 1:
                snapshot = _a.sent();
                if (snapshot.empty) {
                    res.status(404).json({ error: "Usuario no encontrado" });
                }
                else {
                    userData = snapshot.docs[0].data();
                    res.json({
                        userData: userData,
                    });
                }
                ;
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error("Error al crear al buscar el usuario en la base de datos", err_1);
                res.status(500).send("Error al crear al buscar el usuario en la base de datos");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
//CREAR NUEVO GAMEROOM EN LA RTDB
app.post("/createRoom", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameroomId, shortRoomId, hostData, players, history_1, newGameRoom, gameRoomData, newGameroomRef, newGameroomData, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                gameroomId = (0, uuid_1.v4)();
                shortRoomId = Math.ceil(Math.random() * 1000000);
                hostData = req.body;
                players = [{ host: { name: hostData.name, id: hostData.id, email: hostData.email } }];
                history_1 = {
                    host: 0,
                    guest: 0,
                    empate: 0,
                };
                newGameRoom = gameroomsCollection.doc();
                gameRoomData = {
                    gameroomId: gameroomId,
                    shortRoomId: shortRoomId,
                    players: players,
                    history: history_1,
                };
                return [4 /*yield*/, newGameRoom.create(gameRoomData)];
            case 1:
                _b.sent();
                newGameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameroomId));
                newGameroomData = {
                    shortRoomId: shortRoomId,
                    currentGame: (_a = {},
                        _a[hostData.id] = {
                            name: hostData.name,
                            move: "",
                            online: true,
                            host: true,
                            ready: false
                        },
                        _a),
                    winner: ""
                };
                return [4 /*yield*/, newGameroomRef.set(newGameroomData)];
            case 2:
                _b.sent();
                res.status(201).json({
                    message: "Sala creada con Id: ".concat(gameroomId),
                    gameroomId: gameroomId,
                    shortRoomId: shortRoomId
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Error al crear la sala en la base de datos", error_2);
                res.status(500).send("Error al crear la sala en la base de datos");
                return [3 /*break*/, 4];
            case 4:
                ;
                return [2 /*return*/];
        }
    });
}); });
//CONSEGUIR UNA GAMEROOM
app.get("/gamerooms/:shortRoomId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var shortRoomId, roomSnapshot, roomData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                shortRoomId = req.params.shortRoomId;
                return [4 /*yield*/, gameroomsCollection.where("shortRoomId", "==", parseInt(shortRoomId)).get()];
            case 1:
                roomSnapshot = _a.sent();
                if (roomSnapshot.empty) {
                    res.status(404).json("La sala que estás buscando no existe");
                }
                else {
                    roomData = roomSnapshot.docs[0].data();
                    res.status(200).json({
                        gameroomId: roomData.gameroomId,
                        shortRoomId: shortRoomId,
                        history: roomData.history
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error al buscar la sala en la base de datos", error_3);
                res.status(500).send("Error al buscar la sala en la base de datos");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
//INGRESAR A GAMEROOM EXISTENTE EN LA RTDB
app.post("/joinRoom", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, shortRoomId, userId, userName, userEmail, gameroomSnapshot, gameRoomDoc, gameRoomData, players, user, _i, players_1, player, rtdbGameroomRef, rtdbGameroomRef, rtdbGameroomRef, error_4;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 10, , 11]);
                _a = req.body, shortRoomId = _a.shortRoomId, userId = _a.userId, userName = _a.userName, userEmail = _a.userEmail;
                return [4 /*yield*/, gameroomsCollection.where("shortRoomId", "==", parseInt(shortRoomId)).get()];
            case 1:
                gameroomSnapshot = _e.sent();
                gameRoomDoc = gameroomSnapshot.docs[0];
                gameRoomData = gameRoomDoc.data();
                players = gameRoomData.players;
                user = void 0;
                for (_i = 0, players_1 = players; _i < players_1.length; _i++) {
                    player = players_1[_i];
                    if (player.host && player.host.id === userId) {
                        user = player;
                        break;
                    }
                    else if (player.guest && player.guest.id === userId) {
                        user = player;
                        break;
                    }
                    ;
                }
                ;
                if (!(user == undefined && players.length == 1)) return [3 /*break*/, 4];
                //Agrego al guest e ingreso a la sala
                players.push({ guest: { id: userId, name: userName, email: userEmail } });
                return [4 /*yield*/, gameRoomDoc.ref.update({ players: gameRoomData.players })];
            case 2:
                _e.sent();
                res.status(201).json("Eres un nuevo guest, ingresando a la sala...");
                rtdbGameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameRoomData.gameroomId));
                return [4 /*yield*/, rtdbGameroomRef.update((_b = {},
                        _b["currentGame/".concat(userId)] = {
                            name: userName,
                            move: "",
                            online: true,
                            host: false,
                            ready: false
                        },
                        _b))];
            case 3:
                _e.sent();
                return [3 /*break*/, 9];
            case 4:
                if (!(user == undefined && players.length == 2)) return [3 /*break*/, 5];
                //La sala está completa
                res.status(403).json("La sala está completa.");
                return [3 /*break*/, 9];
            case 5:
                if (!user.host) return [3 /*break*/, 7];
                rtdbGameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameRoomData.gameroomId));
                return [4 /*yield*/, rtdbGameroomRef.update((_c = {},
                        _c["currentGame/".concat(userId)] = {
                            name: userName,
                            move: "",
                            online: true,
                            host: true,
                            ready: false
                        },
                        _c))];
            case 6:
                _e.sent();
                res.status(200).json("Eres el host, ingresando a la sala...");
                return [3 /*break*/, 9];
            case 7:
                if (!user.guest) return [3 /*break*/, 9];
                rtdbGameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameRoomData.gameroomId));
                return [4 /*yield*/, rtdbGameroomRef.update((_d = {},
                        _d["currentGame/".concat(userId)] = {
                            name: userName,
                            move: "",
                            online: true,
                            host: false,
                            ready: false
                        },
                        _d))];
            case 8:
                _e.sent();
                res.status(200).json("Eres el guest, ingresando a la sala...");
                _e.label = 9;
            case 9:
                ;
                return [3 /*break*/, 11];
            case 10:
                error_4 = _e.sent();
                console.error("Error al unirse a la sala", error_4);
                res.status(500).send("Error al unirse a la sala");
                return [3 /*break*/, 11];
            case 11:
                ;
                return [2 /*return*/];
        }
    });
}); });
//SET READY
app.post("/setReady", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameroomId, userId, gameroomRef, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, gameroomId = _a.gameroomId, userId = _a.userId;
                gameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameroomId, "/currentGame"));
                return [4 /*yield*/, gameroomRef.child(userId).update({
                        ready: true
                    })];
            case 1:
                _b.sent();
                res.status(200).json("El jugador está listo para inicar la partida");
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error("Error al setear el estado del usuario", error_5);
                res.status(500).send("Error al setear el estado del usuario");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
//SETEAR MOVIMIENTO
app.post("/setMove", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameroomId, whoId, move, whoRef, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                gameroomId = req.body.gameroomId;
                whoId = req.body.whoId;
                move = req.body.move;
                whoRef = db_1.rtdb.ref("/gamerooms/".concat(gameroomId, "/currentGame/").concat(whoId));
                return [4 /*yield*/, whoRef.update({ move: move })];
            case 1:
                _a.sent();
                res.status(200).json("Movimiento realizado correctamente");
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error al setear el movimiento del usuario", error_6);
                res.status(500).send("Error al setear el movimiento del usuario");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
//SETEAR GANADOR
app.post("/setWinner", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameroomId, winner, gameroomRef, firestoreGameroom, roomDoc, roomData, history_2, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, gameroomId = _a.gameroomId, winner = _a.winner;
                gameroomRef = db_1.rtdb.ref("/gamerooms/".concat(gameroomId));
                return [4 /*yield*/, gameroomRef.update({
                        winner: winner
                    })];
            case 1:
                _b.sent();
                firestoreGameroom = gameroomsCollection.where("gameroomId", "==", gameroomId).get();
                return [4 /*yield*/, firestoreGameroom];
            case 2:
                roomDoc = (_b.sent()).docs[0];
                roomData = roomDoc.data();
                history_2 = roomData.history;
                history_2[winner]++;
                return [4 /*yield*/, roomDoc.ref.update({ history: history_2 })];
            case 3:
                _b.sent();
                res.status(200).json({
                    message: "El ganador es: \u00A1".concat(winner, "!"),
                    history: history_2
                });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _b.sent();
                console.error("Error al definir al ganador", error_7);
                res.status(500).send("Error al definir al ganador");
                return [3 /*break*/, 5];
            case 5:
                ;
                return [2 /*return*/];
        }
    });
}); });
//TERMINAR PARTIDA
app.post("/endGame", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameroomId, hostId, guestId, gameroomRef, currentGameRef, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, gameroomId = _a.gameroomId, hostId = _a.hostId, guestId = _a.guestId;
                gameroomRef = db_1.rtdb.ref("gamerooms/".concat(gameroomId));
                currentGameRef = db_1.rtdb.ref("gamerooms/".concat(gameroomId, "/currentGame"));
                return [4 /*yield*/, currentGameRef.child(hostId).update({
                        ready: false,
                        move: ""
                    })];
            case 1:
                _b.sent();
                return [4 /*yield*/, currentGameRef.child(guestId).update({
                        ready: false,
                        move: ""
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, gameroomRef.update({ winner: "" })];
            case 3:
                _b.sent();
                res.status(200).json({
                    rtdb: currentGameRef,
                    winner: ""
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _b.sent();
                console.error("Error al definir al ganador", error_8);
                res.status(500).send("Error al definir al ganador");
                return [3 /*break*/, 5];
            case 5:
                ;
                return [2 /*return*/];
        }
    });
}); });
//DESCONECTAR JUGADOR
app.post("/disconnectPlayer", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameroomId, playerId, currentGameRef, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, gameroomId = _a.gameroomId, playerId = _a.playerId;
                currentGameRef = db_1.rtdb.ref("gamerooms/".concat(gameroomId, "/currentGame"));
                return [4 /*yield*/, currentGameRef.child(playerId).update({ move: "", ready: false })];
            case 1:
                _b.sent();
                res.status(200).json("El jugador se ha desconectado");
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                console.error("Error al definir al ganador", error_9);
                res.status(500).send("Error al desconectar al jugador");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});
