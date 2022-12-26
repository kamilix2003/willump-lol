import { HTTPrequest, MakeRequestLink, parseURLParams, API_KEY, NewElement } from "./func.js";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

const ctx = document.getElementById('myChart');

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`

HTTPrequest("GET", matchurl).then(matchdata => {
    HTTPrequest("GET", timelineurl).then(timeline =>{
        console.log("match data:", matchdata);
        console.log("match timeline:",timeline);

        let currentGold = getTimelineDataPlayers(timeline, "totalGold");

        let dataSet = makeChartDataSet(currentGold[1], "totalGold");
        let labels = makeChartLabels(dataSet.data.length, 1, 1);
        let chartData = makeChartData([dataSet], labels, "line", {});
        console.log(chartData);
        
        makeNewChartElement(".chart-container", "test1", chartData);
    })
  })

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
