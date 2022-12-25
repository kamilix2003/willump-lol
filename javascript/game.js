import { HTTPrequest, MakeRequestLink, parseURLParams, API_KEY } from "./func.js";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`
HTTPrequest("GET", matchurl).then(matchdata => {
    HTTPrequest("GET", timelineurl).then(timeline =>{
        console.log(matchdata);
        console.log(timeline);
    })
})
