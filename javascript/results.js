import { parseURLParams, MakeRequestLink, HTTPrequest, SummonerIconURL, API_KEY} from "./func.js";

const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
const LEAGUE_INFO_REQUEST = "/lol/league/v4/entries/by-summoner/";

function DisplayResults(){
    let UrlData = parseURLParams(window.location.href);
    let PlayerUserName = UrlData.summonername;
    let region =  UrlData.region;
    if(region != "" && PlayerUserName != ""){
        let SummonerInfourl = MakeRequestLink(SUMMONER_INFO_REQUEST,region,PlayerUserName);
        let data = HTTPrequest("GET", SummonerInfourl).then(data => {
            let iconURL = SummonerIconURL(data.profileIconId);
            document.querySelector(".summonericon").src = iconURL;
            document.querySelector(".match-champ-img").src = iconURL;
            document.querySelector(".summonerlevel").innerHTML = data.summonerLevel;
            document.querySelector(".summonername").innerHTML = data.name;
            let MatchHistory = GetMatchHistory(data.puuid,"europe", [ , , , , , 5]);
            let LeagueInfourl = MakeRequestLink(LEAGUE_INFO_REQUEST,region,data.id);
            HTTPrequest("GET", LeagueInfourl).then(response => {
               // console.log(response);
                for(let i = 0; i < response.length; i++){
                    console.log(response[i]);
                    if(response[i].queueType == "RANKED_SOLO_5x5"){
                        document.querySelector(".solo").innerHTML = response[i].tier + response[i].rank;
                    }else if(response[i].queueType == "RANKED_FLEX_SR"){
                        document.querySelector(".flex").innerHTML = response[i].tier + response[i].rank;
                    }
                }
            }).catch(response => {
                console.log(response);
            });
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
        const matches = document.querySelector(".grid-matchhistory");
        for(let i = 0; i < data.length; i++){
            let NewMatch = NewElement(`
            <div class="match">
                <img class="match-champ-img" src="" alt="">
                <h3 class="match-champ">champ</h3>
                <p class="match-date">date</p>
                <p class="match-id"> ${data[i]} </p>
            </div>
            `)
            matches.appendChild(NewMatch);
        }
        return data;
    })
}

const greeting = document.querySelector("#greeting");
greeting.onload = DisplayResults();

function NewElement(html){
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
