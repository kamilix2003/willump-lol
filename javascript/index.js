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

submitbtn.onclick = () => playerfound();
// document.querySelector("#test").onclick = () => playerfound();
//
function playerfound() {
    let playerUrl = `http://localhost:3000/getsummoner?region=${regionselection.value}&name=${input.value}`
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
