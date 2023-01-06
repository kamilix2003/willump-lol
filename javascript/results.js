import { parseURLParams, MakeRequestLink, HTTPrequest, SummonerIconURL, NewElement, unixToDate, askForApiKey, regions, getCurrentVersion, getSummonerSpell} from "./func.js";

askForApiKey();

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    loader.classList.add("loaded");
})

const API_KEY = sessionStorage.getItem("API_KEY")

const currentVersion = await getCurrentVersion();

const SUMMONER_INFO_REQUEST = "/lol/summoner/v4/summoners/by-name/";
const LEAGUE_INFO_REQUEST = "/lol/league/v4/entries/by-summoner/";
const MATCH_INFO_REQUEST = "/lol/match/v5/matches/";

let summonerSpells = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/summoner.json`).then(res => {
    return res.json();
});

console.log(summonerSpells);

DisplayResults();

function DisplayResults(){
    let UrlData = parseURLParams(window.location.href);
    let PlayerUserName = UrlData.summonername;
    let region =  UrlData.region;
    let matchCount = 5;
    if(region != "" && PlayerUserName != ""){
        let SummonerInfourl = MakeRequestLink(SUMMONER_INFO_REQUEST,region,PlayerUserName);
        HTTPrequest("GET", SummonerInfourl).then(summonerdata => {
            let iconURL = SummonerIconURL(summonerdata.profileIconId);
            document.querySelector(".summonericon").src = iconURL;
            document.querySelector(".summonerlevel").innerHTML = "Level: " + summonerdata.summonerLevel;
            document.querySelector(".summonername").innerHTML = summonerdata.name;
            let matchhistoryurl = GetMatchHistory(summonerdata.puuid, regions[region].continent , [ , , , , , matchCount]);

            HTTPrequest("GET",matchhistoryurl).then(matchhistory => {
                // console.log(matchhistory);
                const matches = document.querySelector(".grid-matchhistory");
                let matcharray = [];
                for(let i = 0; i < matchhistory.length; i++){
                    let url2 = MakeRequestLink(MATCH_INFO_REQUEST,regions[region].continent,matchhistory[i])
                    HTTPrequest("GET", url2).then(matchdata => {
                        // let gameVersion = `${matchdata.info.gameVersion.split(".")[0]}.${matchdata.info.gameVersion.split(".")[1]}`;
                        let participants = matchdata.metadata.participants;
                        let summoner;
                        for(let i = 0; i < participants.length; i++){
                            if(participants[i] == summonerdata.puuid){
                                summoner = i;
                            }
                        }
                        let summonerSpell1 = getSummonerSpell(matchdata.info.participants[summoner].summoner1Id, summonerSpells).image.full;
                        let summonerSpell2 = getSummonerSpell(matchdata.info.participants[summoner].summoner2Id, summonerSpells).image.full;
                        let kda = [matchdata.info.participants[summoner].kills, matchdata.info.participants[summoner].deaths, matchdata.info.participants[summoner].assists];
                        let matchresult = matchdata.info.participants[summoner].win;
                        let matchdate = new Date(matchdata.info.gameCreation);
                        let NewMatch = NewElement(`
                        <a href="game.html?matchid=${matchhistory[i]}">
                        <div class="match match-${i}  win-${matchresult}">
                            <img class="match-champ-img" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${matchdata.info.participants[summoner].championName}.png" alt="">
                            <h3 class="match-champ">${matchdata.info.participants[summoner].championName}</h3>
                            <p class="match-kda">${kda[0]}/${kda[1]}/${kda[2]}</p>
                            <p class="game-mode">${matchdata.info.gameMode}</p>
                            <p class="match-date">${unixToDate(matchdate)}</p>
                            <div>
                            <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpell1}" alt="">
                            <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpell2}" alt="">
                            </div>
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

            document.querySelector(".more-games").addEventListener("click", async () => {
                let url = GetMatchHistory(summonerdata.puuid, regions[region].continent , [ , , , , matchCount++, 1]);
                let matchResponse = await fetch(url).then( res => {
                    return res.json();
                })
                console.log(matchResponse)
                let matchurl = MakeRequestLink(MATCH_INFO_REQUEST,regions[region].continent, matchResponse[0]);
                let matchdata = await fetch(matchurl).then(res => {
                    return res.json();
                })
                let summoner;
                for(let i = 0; i < 10; i++){
                    if(matchdata.info.participants[i].summonerName == PlayerUserName){
                        summoner = i;
                    }
                }
                let matchresult = matchdata.info.participants[summoner].win;
                let kda = [
                    matchdata.info.participants[summoner].kills,
                    matchdata.info.participants[summoner].deaths,
                    matchdata.info.participants[summoner].assists
                ]
                let summonerSpell1 = getSummonerSpell(matchdata.info.participants[summoner].summoner1Id, summonerSpells).image.full;
                let summonerSpell2 = getSummonerSpell(matchdata.info.participants[summoner].summoner2Id, summonerSpells).image.full;
                let NewMatch = NewElement(`
                    <a href="game.html?matchid=${matchResponse[0]}">
                    <div class="match match-${matchCount}  win-${matchresult}">
                        <img class="match-champ-img" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${matchdata.info.participants[summoner].championName}.png" alt="">
                        <h3 class="match-champ">${matchdata.info.participants[summoner].championName}</h3>
                        <p class="match-kda">${kda[0]}/${kda[1]}/${kda[2]}</p>
                        <p class="game-mode">${matchdata.info.gameMode}</p>
                        <p class="match-date">${unixToDate(matchdata.info.gameCreation)}</p>
                        <div>
                        <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpell1}" alt="">
                        <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpell2}" alt="">
                        </div>
                        <p class="match-id" hidden> ${matchResponse[0]} </p>
                    </div>
                    </a>
                    `);
                document.querySelector(".grid-matchhistory").appendChild(NewMatch);
            })
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

