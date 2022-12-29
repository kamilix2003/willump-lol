import { API_KEY } from "../API_KEY.js";
import { HTTPrequest, MakeRequestLink, parseURLParams, NewElement } from "./func.js";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

const ctx = document.getElementById('myChart');

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`;
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`;

document.getElementById("matchid").innerHTML += ` ${urlData.matchid}`;

let runesData = await fetch("https://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json").then(res => {
  return res.json();
});


HTTPrequest("GET", matchurl).then(matchdata => {
  let summoners = matchdata.info.participants;
  
  for(let i = 0; i < summoners.length; i++){
    let matchresult = matchdata.info.participants[i].win;
    let summoner = NewElement(`
    <div class="summoner win-${matchresult}" id="summoner-${i}">
      <a class="summoner-link" id="summoner-link-${i}" href="results.html?region=EUN1&summonername=${summoners[i].summonerName}">
        <img class="champion-img" id="champion-img-${i}" src="https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${summoners[i].championName}.png" alt="">
        <p class="champion-name" id="champion-name-${i}">${summoners[i].championName}</p>
        <p class="summoner-name" id="summoner-name-${i}">${summoners[i].summonerName}</p>
      </a>
        <button class="stats-btn" id="summoner-stats-btn-${i}">&#10140</button>
    </div>  
    `);

    let summonerContainer = document.querySelector(".match-summoners-container");
    summonerContainer.appendChild(summoner);
    
    document.querySelector(`#summoner-stats-btn-${i}`).addEventListener("click",(event) => {
      let items = [
        summoners[i].item0,
        summoners[i].item1,
        summoners[i].item2,
        summoners[i].item3,
        summoners[i].item4,
        summoners[i].item5
      ]
      let runes = {
        main:{
          row1: findRune(summoners[i].perks.styles[0].selections[0].perk, runesData),
          row2: findRune(summoners[i].perks.styles[0].selections[1].perk, runesData),
          row3: findRune(summoners[i].perks.styles[0].selections[2].perk, runesData),
          row4: findRune(summoners[i].perks.styles[0].selections[3].perk, runesData),
        },
        secondary:{
          row1: findRune(summoners[i].perks.styles[1].selections[0].perk, runesData),
          row2: findRune(summoners[i].perks.styles[1].selections[1].perk, runesData),
        },
      }

      let stats = {
        kills: summoners[i].kills,
        deaths: summoners[i].deaths,
        assists: summoners[i].assists,
        damageDealt: summoners[i].totalDamageDealtToChampions,
        damageTaken: summoners[i].totalDamageTaken,
        visionScore: summoners[i].visionScore,
        totalMinionsKilled: summoners[i].totalMinionsKilled,
        neutralMinionsKilled: summoners[i].neutralMinionsKilled,
        farm: function(){
          return this.totalMinionsKilled + this.neutralMinionsKilled
        },
      }
      let statsDiv = NewElement(`
      <div class="summoner-stats-container-child">
      <button id="button-${i}">test</button>
      <select name="select" id="select">
        <option value="currentGold">cg</option>
        <option value="totalGold">tg</option>
        <option value="championStats.healthMax">max hp</option>
      </select>
      <p>kda: ${stats.kills}/${stats.deaths}/${stats.assists}</p>
      <p>dmg dealt: ${stats.damageDealt}</p>
      <p>dmg taken: ${stats.damageTaken}</p>
      <p>vision score: ${stats.visionScore}</p>
      <p>farm: ${stats.farm()}</p>
      <div class="items">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[0]}.png" alt="">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[1]}.png" alt="">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[2]}.png" alt="">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[3]}.png" alt="">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[4]}.png" alt="">
          <img class="item-icon" src="http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${items[5]}.png" alt="">
      </div>
      <div class="runes">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.main.row1.icon}" alt="">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.main.row2.icon}" alt="">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.main.row3.icon}" alt="">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.main.row4.icon}" alt="">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.secondary.row1.icon}" alt="">
          <img class="rune-icon" src="http://ddragon.leagueoflegends.com/cdn/img/${runes.secondary.row2.icon}" alt="">
        </div>
      </div>
      `)
      //http://ddragon.leagueoflegends.com/cdn/12.23.1/img/perk-images/Styles      
      //[1].perks.styles[0].selections[0]
      
      document.querySelector(".summoner-stats-container").innerHTML = "";
      document.querySelector(".summoner-stats-container").appendChild(statsDiv);
      document.querySelector(".chart-container").innerHTML = "";
      document.querySelector(`#button-${i}`).addEventListener("click",(test) => {
        let selected = document.querySelector("#select").value;
        HTTPrequest("GET", timelineurl).then(timeline =>{
          // console.log("match data:", matchdata);
          console.log("match timeline:",timeline);
          console.log(timeline.info.frames);

          if(document.querySelector(`#${selected}`) != null){
            document.querySelector(`#${selected}`).remove();
            console.log("dsaf")
          }
  
          let frames = playerFrames(timeline);
  
          let x = chartData(frames[i], [selected], [selected], "line");
  
          console.log(x);
  
          makeNewChartElement(".chart-container", selected, x);
      })
      })


    })
  }

  })

function chartData(playerframes, paths, labels, type){
  let datasets = new Array();
  for(let path = 0; path < paths.length; path++){
    datasets.push(makeChartDataSet(getFromObject(playerframes, paths[path]), labels[path]))
  }
  let chartData = makeChartData(datasets, makeChartLabels(playerframes.length, 0, 1), type)
  return chartData
}

function getFromObject(obj, path){
  let keys = path.split(".");
  let output = new Array();
  let temp;
  for(let frame = 0; frame < obj.length; frame++){
    //console.log(obj[frame]);
    temp = obj[frame];
    for(let key = 0; key < keys.length; key++){
      temp = temp[keys[key]];
    }
    output.push(temp);
  }
  return output;
}


function playerFrames(timeline){
  let frames = timeline.info.frames;
  let playerCount = 10;
  let output = new Array();
  for(let player = 1; player <= playerCount; player++){
    output[player-1] = new Array();
    for(let frame = 0; frame < frames.length; frame++){
      output[player-1].push(frames[frame].participantFrames[player]);
    }
  }
  return output;
}


function findRune(runeId, runesJson){
  let output;
  for(let i = 0; i < runesJson.length; i++){
    for(let ii = 0; ii < runesJson[i].slots.length; ii++){
      runesJson[i].slots[ii].runes.find(childElement => {
        if(childElement.id == runeId){
          output = childElement;
        };
      })
    }
  }
  return output;
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


function getTimelineDataevents(timeline, data){
    let frameCount = timeline.info.frames.length;
    let output = [
        [],
    ]

}
