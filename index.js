const API_KEY = "RGAPI-bde7d8c2-c271-439d-ac88-88c95b171267";
const EUNE = "EUN1"; 
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
PlayerUserName = "";

function SubmitUserName(){
    PlayerUserName = document.getElementById("usernameinput").value;
    let url = MakeRequestLink(SUMMONER_INFO_REQUEST,EUNE,PlayerUserName);
    let data = HTTPrequest("GET", url).then(data => {
        let iconURL = SummonerIconURL(data.profileIconId);
        document.getElementById("summonericon").src = iconURL;
        document.getElementById("summonerlevel").innerHTML = data.summonerLevel;
        document.getElementById("summonername").innerHTML = data.name;
    })
}

function SummonerIconURL(summonericonnumber){
    return "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/"+ summonericonnumber +".png"
}

function MakeRequestLink(request_link, region, PlayerUserName){
    return "https://" + region + ".api.riotgames.com" + request_link + PlayerUserName+ "?api_key=" + API_KEY;
}

function HTTPrequest(method, url){
    const promise = new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open(method, url);
        req.responseType = "json";
        req.send();
        req.onload = () => {
            if (req.readyState == 4 && req.status == 200) {
              const data = req.response;
              resolve(data);
            } else {
              console.log(`Error: ${req.status}`);
            }
        }
    });
    return promise;
}

