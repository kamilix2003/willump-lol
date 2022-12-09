const API_KEY = "RGAPI-3a6a1ad6-94a9-4449-a4d0-ebc43b71df85";
const EUNE = "EUN1"; 
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
PlayerUserName = "";

function SubmitUserName(){
    PlayerUserName = document.getElementById("usernameinput").value;
    getHTTPrequest(MakeRequestLink(SUMMONER_INFO_REQUEST, EUNE, PlayerUserName));
   // document.getElementById("summonericon").src = "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/"+ data.profileIconId +".png";
}

function MakeRequestLink(request_link, region, PlayerUserName){
    return "https://" + region + ".api.riotgames.com" + request_link + PlayerUserName+ "?api_key=" + API_KEY;
    //console.log(request);
}

function getHTTPrequest(request){
    const req = new XMLHttpRequest();
    req.open("GET",request);
    req.send();
    req.responseType = "json";
    req.onload = () => {
        if (req.readyState == 4 && req.status == 200) {
          const data = req.response;
          console.log(data.profileIconId);
        } else {
          console.log(`Error: ${req.status}`);
        }
    }
}


