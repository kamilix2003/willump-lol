const API_KEY = "RGAPI-ddebdc96-a7d9-461d-a15b-bfc523f409f4";
const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";

const body = document.getElementById("mainbody");
body.addEventListener('load', SubmitUserName);

function SubmitUserName(){
    let UrlData = parseURLParams(window.location.href);
    let PlayerUserName = UrlData.summonername;
    let region =  UrlData.region;
    if(region != "" && PlayerUserName != ""){
        let url = MakeRequestLink(SUMMONER_INFO_REQUEST,region,PlayerUserName);
        let data = HTTPrequest("GET", url).then(data => {
            let iconURL = SummonerIconURL(data.profileIconId);
            document.getElementById("summonericon").src = iconURL;
            document.getElementById("summonerlevel").innerHTML = data.summonerLevel;
            document.getElementById("summonername").innerHTML = data.name;
            GetMatchHistory(data.puuid,"europe", [ , , , , , 5])
        })
    }
}
function GetMatchHistory(puuid, regionContinent, ids = [startTime, endTime, queue, type, start, count]){
    let ids_link = "";
    let idsTags = ["startTime", "endTime", "queue", "type", "start", "count"];
    for(let i = 0; i < idsTags.length; i++){
        if(ids[i] != undefined){
            ids_link += idsTags[i] +"="+ ids[i] + "&";
        }
    }
    let url = "https://"+regionContinent+".api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?"+ids_link+"api_key="+API_KEY;
    HTTPrequest("GET",url).then(data => {
        console.log(data);
    })
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

function SummonerIconURL(summonericonnumber){
    return "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/"+ summonericonnumber +".png"
}

function MakeRequestLink(request_link, region, PlayerUserName){
    return "https://" + region + ".api.riotgames.com" + request_link + PlayerUserName+ "?api_key=" + API_KEY;
}

function parseURLParams(url) {
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

