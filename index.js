const API_KEY = "RGAPI-3a6a1ad6-94a9-4449-a4d0-ebc43b71df85";
const EUNE = "EUN1"; 
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
PlayerUserName = "";

function SubmitUserName(){
    PlayerUserName = document.getElementById("usernameinput").value;
}

function MakeRequestLink(request_link, region, PlayerUserName){
    return "https://" + region + ".api.riotgames.com" + request_link + PlayerUserName+ "?api_key=" + API_KEY;
}


