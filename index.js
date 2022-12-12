const API_KEY = "RGAPI-ced84f47-dc25-467f-96a4-f78ffe01cfea";
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";

function SubmitUserName(){
    let PlayerUserName = document.getElementById("usernameinput").value;
    let region =  GetRegion();
    if(region != "" && PlayerUserName != ""){
        let url = MakeRequestLink(SUMMONER_INFO_REQUEST,region,PlayerUserName);
        let data = HTTPrequest("GET", url).then(data => {
            let iconURL = SummonerIconURL(data.profileIconId);
            document.getElementById("summonericon").src = iconURL;
            document.getElementById("summonerlevel").innerHTML = data.summonerLevel;
            document.getElementById("summonername").innerHTML = data.name;
        })
    }else{
        if(region == "")
            document.getElementById("summonername").innerHTML = "Select region!";
        else 
            document.getElementById("summonername").innerHTML = "Type in summoner name";
    }

}

function GetRegion(){
    const form = document.getElementById("selectregion");
    const radios = form.elements["region"];
    return radios.value;    
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
              reject(req.status);
            }
        }
    });
    return promise;
}

