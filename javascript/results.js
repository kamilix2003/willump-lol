import { parseURLParams, MakeRequestLink, HTTPrequest, SummonerIconURL, NewElement, unixToDate, askForApiKey, regions, getCurrentVersion} from "./func.js";

askForApiKey();

const API_KEY = sessionStorage.getItem("API_KEY")

const currentVersion = await getCurrentVersion();

const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
const LEAGUE_INFO_REQUEST = "/lol/league/v4/entries/by-summoner/";
const MATCH_INFO_REQUEST = "/lol/match/v5/matches/";

DisplayResults();

function DisplayResults(){
    let UrlData = parseURLParams(window.location.href);
    let PlayerUserName = UrlData.summonername;
    let region =  UrlData.region;
    if(region != "" && PlayerUserName != ""){
        let SummonerInfourl = MakeRequestLink(SUMMONER_INFO_REQUEST,region,PlayerUserName);
        HTTPrequest("GET", SummonerInfourl).then(summonerdata => {
            let iconURL = SummonerIconURL(summonerdata.profileIconId);
            document.querySelector(".summonericon").src = iconURL;
            document.querySelector(".summonerlevel").innerHTML = summonerdata.summonerLevel;
            document.querySelector(".summonername").innerHTML = summonerdata.name;
            let matchhistoryurl = GetMatchHistory(summonerdata.puuid, regions[region].continent , [ , , , , , 10]);

            HTTPrequest("GET",matchhistoryurl).then(matchhistory => {
                // console.log(matchhistory);
                const matches = document.querySelector(".grid-matchhistory");
                let matcharray = [];
                for(let i = 0; i < matchhistory.length; i++){
                    let url2 = MakeRequestLink(MATCH_INFO_REQUEST,regions[region].continent,matchhistory[i])
                    HTTPrequest("GET", url2).then(matchdata => {
                        // console.log({matchdata});
                        // let gameVersion = `${matchdata.info.gameVersion.split(".")[0]}.${matchdata.info.gameVersion.split(".")[1]}`;
                        let participants = matchdata.metadata.participants;
                        let summoner;
                        for(let i = 0; i < participants.length; i++){
                            if(participants[i] == summonerdata.puuid){
                                summoner = i;
                            }
                        }
                        let kda = [matchdata.info.participants[summoner].kills, matchdata.info.participants[summoner].deaths, matchdata.info.participants[summoner].assists];
                        let matchresult = matchdata.info.participants[summoner].win;
                        let NewMatch = NewElement(`
                        <a href="game.html?matchid=${matchhistory[i]}">
                        <div class="match match-${i} win-${matchresult}">
                            <img class="match-champ-img" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${matchdata.info.participants[summoner].championName}.png" alt="">
                            <h3 class="match-champ">${matchdata.info.participants[summoner].championName}</h3>
                            <p class="match-kda">${kda[0]}/${kda[1]}/${kda[2]}</p>
                            <p class="game-mode">${matchdata.info.gameMode}</p>
                            <p class="match-date">${unixToDate(matchdata.info.gameCreation)}</p>
                            <p class="match-id" hidden> ${matchhistory[i]} </p>
                        </div>
                        </a>
                        `)
                        // matches.appendChild(NewMatch);
                        matcharray[i] = NewMatch;
                        if(matcharray.length == matchhistory.length){
                            for(let i = 0; i < matcharray.length;i++){
                                matches.appendChild(matcharray[i]);
                            }
                        }
                    });
                }
            })

            let LeagueInfourl = MakeRequestLink(LEAGUE_INFO_REQUEST,region,summonerdata.id);
            HTTPrequest("GET", LeagueInfourl).then(response => {
               // console.log(response);
                for(let i = 0; i < response.length; i++){
                    if(response[i].queueType == "RANKED_SOLO_5x5"){
                        document.querySelector(".solo").innerHTML = `Solo/Duo: ${response[i].rank} ${response[i].tier} ${response[i].leaguePoints}LP` ;
                    }else if(response[i].queueType == "RANKED_FLEX_SR"){
                        document.querySelector(".flex").innerHTML = `Flex: ${response[i].rank} ${response[i].tier} ${response[i].leaguePoints}LP`;
                    }
                }
            }).catch(response => {
                // console.log(response);
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
    return url;
}

