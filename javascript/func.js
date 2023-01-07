const API_KEY = sessionStorage.getItem("API_KEY")

export async function getCurrentVersion(){
    let output = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`).then(res => {
        return res.json();
    })
    return output[0];
}

export function askForApiKey(){
    if (sessionStorage.getItem("API_KEY") == "" || sessionStorage.getItem("API_KEY") == "null" || sessionStorage.getItem("API_KEY") == null) {
        alert(`you can get your api key on https://developer.riotgames.com/`);
        let promptInput = prompt(`api key:`);
        if(promptInput.length == 42 && promptInput.substring(0, 5) == "RGAPI"){
            sessionStorage.setItem("API_KEY", promptInput);
        }
        else{
            alert("Invalid key");
        }
        window.location.reload();
    }
}

export function clearApiKey(){
    sessionStorage.removeItem("API_KEY");
}

export const regions = {
    EUN1: {
        region: "EUNE",
        continent: "europe",
    },
    EUW1: {
        region: "EUW",
        continent: "europe",
    },
    NA1: {
        region: "NA",
        continent: "americas",
    },
    KR:{
        region: "KR",
        continent: "asia"
    }
}

export function unixToDate(unixTime) {
    let date = new Date(unixTime);
    return `${date.toDateString()} ${date.getHours() < 10 ? `0${date.getHours()}`: date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}`: date.getMinutes()}`;
  }

function DisplayMatchHistory(data, id){
    for(let i = 0; i < data.length; i++)
    {
        document.getElementById(id).innerHTML += data[i] + "<br>";
    }
}
 
function GetRegion(){
    const form = document.getElementById("selectregion");
    const radios = form.elements["region"];
    return radios.value;    
}

export function SummonerIconURL(summonericonnumber){
    return "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/"+ summonericonnumber +".png"
}

export function MakeRequestLink(request_link, region, PlayerUserName){
    return "https://" + region + ".api.riotgames.com" + request_link + PlayerUserName+ "?api_key=" + API_KEY;
}

export function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

export async function HTTPrequest(method, url){
    const promise = new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open(method, url);
        req.responseType = "json";
        req.send();
        req.onload = () => {
            if (req.readyState == 4 && req.status == 200) {
              resolve(req.response);
            } else {
              reject(req, "1");
            }
        }
    });
    return promise;
}

export function NewElement(html){
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

