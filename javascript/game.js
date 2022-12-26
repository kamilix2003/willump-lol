import { HTTPrequest, MakeRequestLink, parseURLParams, API_KEY, NewElement } from "./func.js";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

const ctx = document.getElementById('myChart');

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`;
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`;

document.getElementById("matchid").innerHTML += ` ${urlData.matchid}`;

HTTPrequest("GET", matchurl).then(matchdata => {
  let summoners = matchdata.info.participants;
  console.log(summoners);
  for(let i = 0; i < summoners.length; i++){
    let summoner = NewElement(`
    <div class="summoner" id="summoner-${i}">
      <a class="summoner-link" id="summoner-link-${i}" href="results.html?region=EUN1&summonername=${summoners[i].summonerName}">
        <img class="champion-img" id="champion-img-${i}" src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${summoners[i].championName}_0.jpg" alt="">
        <p id="champion-name-${i}">${summoners[i].championName}</p>
        <p id="summoner-name-${i}">${summoners[i].summonerName}</p>
      </a>
        <button id="summoner-stats-btn-${i}">🔥=></button>
    </div>  
    `);
    let summonerContainer = document.querySelector(".match-summoners-container");
    summonerContainer.appendChild(summoner);
    document.querySelector(`#summoner-stats-btn-${i}`).addEventListener("click",(event) => {
      let statsDiv = NewElement(`
      <div class="summoner-stats-container">
      <p id="test2">test2</p>
      <p>kda: ${summoners[i].kills}/${summoners[i].deaths}/${summoners[i].assists}</p>
      <p>dmg dealt: ${summoners[i].totalDamageDealtToChampions}</p>
      <p>dmg taken: ${summoners[i].totalDamageTaken}</p>
      <p>vision score: ${summoners[i].visionScore}</p>
      <p>farm: ${summoners[i].totalMinionsKilled + summoners[i].neutralMinionsKilled}</p>
      <div class="items">
          <p>${summoners[i].item0}</p>
          <p>${summoners[i].item1}</p>
          <p>${summoners[i].item2}</p>
          <p>${summoners[i].item3}</p>
          <p>${summoners[i].item4}</p>
          <p>${summoners[i].item5}</p>
      </div>
      <div class="runes">

      </div>
    </div>
      `)
      
      
      
      document.querySelector(".summoner-stats-container").innerHTML = "";
      document.querySelector(".summoner-stats-container").appendChild(statsDiv);

    })
  }


    HTTPrequest("GET", timelineurl).then(timeline =>{
        console.log("match data:", matchdata);
        // console.log("match timeline:",timeline);

        let currentGold = getTimelineDataPlayers(timeline, "currentGold");
        let totalGold = getTimelineDataPlayers(timeline, "totalGold");
        let kills = getTimelineDataPlayers(timeline, "xp")

        let dataSet2 = makeChartDataSet(totalGold[1], "totalGold")
        let dataSet = makeChartDataSet(currentGold[1], "currentGold");
        let dataSet3 = makeChartDataSet(kills[1], "xp")
        let labels = makeChartLabels(dataSet.data.length, 1, 1);
        let chartData = makeChartData([dataSet, dataSet2], labels, "line", {});
        let chartData2 = makeChartData([dataSet2, dataSet3], labels, "line", {});
        
        makeNewChartElement(".chart-container", "test1", chartData);
    })
  })

function displaySummonerStats(summoners) {
  document.getElementById("test2").innerHTML =
    summoners[summonerNumber].championName;
}

function makeChartLabels(length, start, step){
  let labels = []
  for(let i = start; i < start+length*step; i+=step){
    labels.push(i);
  }
  return labels;
}

function makeChartDataSet(data, label){
  let chartDataSet = {
    label: label,
    data: data,
    borderWidth: 3
  }
  return chartDataSet;
}

function makeChartData(dataSets = [], labels = [], type, options){
  let chartData = {
    type: type,
    data: {
      labels: labels,
      datasets: dataSets
    },
    options: options,
  }
  return chartData;
}

function makeNewChartElement(containerClass ,chartId, data){
  let container = document.querySelector(containerClass);
  let chartElement = NewElement(`
    <div class="chart-container">
      <canvas id="${chartId}"></canvas>
    </div> 
  `);
  container.appendChild(chartElement);
  new Chart(chartId, data);
}

function getTimelineDataPlayers(timeline, data){
    let frameCount = timeline.info.frames.length;
    let playerCount = 10;
    let outputData = new Array();
    for(let player = 1; player <= playerCount; player++){
      outputData[player] = new Array();
      for(let frame = 0; frame < frameCount; frame++){
        outputData[player].push(timeline.info.frames[frame].participantFrames[player][data])
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
