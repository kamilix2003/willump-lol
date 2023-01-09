import { askForApiKey, getCurrentVersion} from "./func.js";

let test = await fetch(`http://localhost:3000/`).then(res => {
    return res.json();
})
console.log(test);
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    loader.classList.add("loaded");
  })

let input = document.querySelector("#usernameinput");
let submitbtn = document.querySelector("#submitbtn");
let regionselection = document.querySelector("#region");

askForApiKey();
const API_KEY = sessionStorage.getItem("API_KEY")

submitbtn.onclick = () => playerfound();

function playerfound() {
    let playerUrl = `https://${regionselection.value}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${input.value}?api_key=${API_KEY}`
    fetch(playerUrl).then(player => {
        if (!player.ok) {
            return player.text().then(text => { throw new Error(text) })
        }
        if (player.status == 200) {
            window.location.href = `results.html?region=${regionselection.value}&summonername=${input.value}`;
        }
        console.log(player);
    }).catch(err => {
        console.log(err);
        alert("player not found");
    })
}
