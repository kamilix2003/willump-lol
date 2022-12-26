import { HTTPrequest, MakeRequestLink, parseURLParams, API_KEY } from "./func.js";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

const ctx = document.getElementById('myChart');

let data = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'blank',
        data: [],
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`
HTTPrequest("GET", matchurl).then(matchdata => {
    HTTPrequest("GET", timelineurl).then(timeline =>{
        console.log("match data:", matchdata);
        console.log("match timeline:",timeline);

        data.data.datasets[0].label = "totalGold"
        
        for(let i = 0; i < timeline.info.frames.length; i++){
            data.data.labels.push(i);
            data.data.datasets[0].data.push(timeline.info.frames[i].participantFrames[1].totalGold);
        }

        new Chart(ctx, data);
    })})



function getTimelineDataPlayers(timeline, data){
    let frameCount = timeline.info.frames.length;
    let playerCount = 10;
    let outputData = new Array();
    for(let frame = 0; frame < frameCount; frame++){
        outputData[frame] = new Array();
        for(let player = 1; player <= playerCount; player++){
            outputData[frame].push(timeline.info.frames[frame].participantFrames[player][data])
        }
    }
    return outputData;
}

function getTimelineDataevents(timeline, data){
    let frameCount = timeline.info.frames.length;
    let output = [
        [],
    ]

}
