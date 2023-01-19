import { askForApiKey, getCurrentVersion, passRequest} from "./func.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    loader.classList.add("loaded");
  })

let input = document.querySelector("#usernameinput");
let submitbtn = document.querySelector("#submitbtn");
let regionselection = document.querySelector("#region");

// askForApiKey();
// const API_KEY = sessionStorage.getItem("API_KEY")

let api_url = "";

if(window.location.href == "willump.lol*"){
  api_url = "willump.lol/api";
}
else{
  api_url = "localhost:3000/api";
}


submitbtn.onclick = () => playerfound();
// document.querySelector("#test").onclick = () => playerfound();
//
function playerfound() {
    let playerUrl = `http://${api_url}/getsummoner?region=${regionselection.value}&name=${input.value}`
    fetch(playerUrl)
        .then(player => player.json())
        .then(playerdata => {
        if(playerdata.summonerLevel > 0){
            window.location.href = `results.html?region=${regionselection.value}&summonername=${input.value}`
        }
        else{
            alert(playerdata.status.message);
            console.log(playerdata);
        }
    })
}
