import {Router} from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {path: "/", component: "home-page"},
    {path: "/home", component: "home-page"},
    {path: "/signup", component: "signup-page"},
    {path: "/login", component: "login-page"},
    {path: "/lobby", component: "lobby-page"},
    {path: "/preroom", component: "signup"},
    {path: "/seek-room", component: "seekroom-page"},
    {path: "/room", component: "room-page"},
    {path: "/instruccions", component: "instruccions-page"},
    {path: "/in-game", component: "ingame-page"},
    {path: "/picks", component: "picks-page"},
    {path: "/result", component: "result-page"},
    {path: "/probando", component: "probando-page"},
]);