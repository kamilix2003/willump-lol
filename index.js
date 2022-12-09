const API_KEY = "RGAPI-3a6a1ad6-94a9-4449-a4d0-ebc43b71df85";
const region = "EUN1"
RIOT_REQUEST = "https://" + region + ".api.riotgames.com"
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/"
PlayerUserName = "";

function SubmitUserName(){
    PlayerUserName = document.getElementById("usernameinput").value;
    console.log("hello world");
    console.log(PlayerUserName);
    LogPlayerData();
}

function LogPlayerData(){
    let request = RIOT_REQUEST + SUMMONER_INFO_REQUEST +PlayerUserName+ "?api_key=" + API_KEY;
    console.log(request);
    httpGet(request);
}
