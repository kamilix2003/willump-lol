import { parseURLParams, MakeRequestLink, HTTPrequest, SummonerIconURL, API_KEY, NewElement, unixToDate} from "./func.js";

const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
const LEAGUE_INFO_REQUEST = "/lol/league/v4/entries/by-summoner/";
const MATCH_INFO_REQUEST = "/lol/match/v5/matches/";

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
            let matchhistoryurl = GetMatchHistory(summonerdata.puuid,"europe", [ , , , , , 5]);

            HTTPrequest("GET",matchhistoryurl).then(matchhistory => {
                console.log(matchhistory);
                const matches = document.querySelector(".grid-matchhistory");
                for(let i = 0; i < matchhistory.length; i++){
                    let url2 = MakeRequestLink(MATCH_INFO_REQUEST,"europe",matchhistory[i])
                    let test = HTTPrequest("GET", url2).then(matchdata => {
                        console.log(matchdata);
                        let participants = matchdata.metadata.participants;
                        let summoner;
                        for(let i = 0; i < participants.length; i++){
                            if(participants[i] == summonerdata.puuid){
                                summoner = i;
                            }
                        }
                        let kda = [matchdata.info.participants[summoner].kills, matchdata.info.participants[summoner].assists, matchdata.info.participants[summoner].deaths];
                        let NewMatch = NewElement(`
                        <div class="match" onclick="${""}">
                            <img class="match-champ-img" src=https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchdata.info.participants[summoner].championName}_0.jpg alt="">
                            <h3 class="match-champ">${matchdata.info.participants[summoner].championName}</h3>
                            <p class="match-kda">KDA: ${((kda[0]+kda[1])/kda[2]).toFixed(2)}</p>
                            <p class="game-mode">${matchdata.info.gameMode}</p>
                            <p class="match-date">${unixToDate(matchdata.info.gameCreation)}</p>
                            <p class="match-id" hidden> ${matchhistory[i]} </p>
                        </div>
                        `)
                        matches.appendChild(NewMatch);
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
                console.log(response);
            });
        })
    }
}

function goToMatch(matchid){
    window.location.href = `match.html?matchid=${matchid}`;
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

const greeting = document.querySelector("#greeting");
greeting.onload = DisplayResults();

