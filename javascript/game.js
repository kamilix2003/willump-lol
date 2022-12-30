import { HTTPrequest, MakeRequestLink, parseURLParams, NewElement, askForApiKey } from "./func.js";

askForApiKey();
const API_KEY = sessionStorage.getItem("API_KEY")

const redSide = "red-side";
const blueSide = "blue-side";

const MATCH_REQUEST_LINK = "/lol/match/v5/matches/"

let continent = "europe";

const ctx = document.getElementById('myChart');

let urlData = parseURLParams(window.location.href);
let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?api_key=${API_KEY}`;
let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?api_key=${API_KEY}`;


let runesData = await fetch("https://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json").then(res => {
  return res.json();
});

let championData = await fetch("https://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/champion.json").then(res => {
  return res.json();
})


HTTPrequest("GET", matchurl).then(matchdata => {
  let summoners = matchdata.info.participants;
  const matchtime = new Date(matchdata.info.gameCreation);
  document.querySelector("#date").innerHTML = `${matchtime}`;
  console.log({ matchdata });
  // let team1Kills = document.querySelector("#team1-kills");
  // let team2Kills = document.querySelector("#team2-kills");
  // team1Kills.classList.add(`win-${teamWin1}`);
  // team2Kills.classList.add(`win-${teamWin2}`);
  // team1Kills.innerHTML = matchdata.info.teams[0].objectives.champion.kills;
  // team2Kills.innerHTML = matchdata.info.teams[1].objectives.champion.kills;

  let bans;
  if (matchdata.info.teams[0].bans != 0) {
    bans = [
      [
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[0].bans[0].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[0].bans[1].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[0].bans[2].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[0].bans[3].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[0].bans[4].championId, championData)}.png`,
      ],
      [
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[1].bans[0].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[1].bans[1].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[1].bans[2].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[1].bans[3].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champIdToName(matchdata.info.teams[1].bans[4].championId, championData)}.png`,
      ]
    ]
  } else {
    bans = [
      [
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
      ],
      [
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
        "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png",
      ]
    ]
  }

  let team1Stats = {
    id: matchdata.info.teams[0].teamId,
    win: matchdata.info.teams[0].win,
    firstBlood: matchdata.info.teams[0].objectives.champion.first,
    kills: matchdata.info.teams[0].objectives.champion.kills,
    dragons: matchdata.info.teams[0].objectives.dragon.kills,
    heralds: matchdata.info.teams[0].objectives.riftHerald.kills,
    barons: matchdata.info.teams[0].objectives.baron.kills,
    towers: matchdata.info.teams[0].objectives.tower.kills,
    firstTower: matchdata.info.teams[0].objectives.tower.first,
    inhibitors: matchdata.info.teams[0].objectives.inhibitor.kills,
  }

  let team2Stats = {
    id: matchdata.info.teams[1].teamId,
    win: matchdata.info.teams[1].win,
    firstBlood: matchdata.info.teams[1].objectives.champion.first,
    kills: matchdata.info.teams[1].objectives.champion.kills,
    dragons: matchdata.info.teams[1].objectives.dragon.kills,
    heralds: matchdata.info.teams[1].objectives.riftHerald.kills,
    barons: matchdata.info.teams[1].objectives.baron.kills,
    towers: matchdata.info.teams[1].objectives.tower.kills,
    firstTower: matchdata.info.teams[1].objectives.tower.first,
    inhibitors: matchdata.info.teams[1].objectives.inhibitor.kills,
  }

  let Team1 = NewElement(`
    <div>
    <p class="win win-${team1Stats.win}">${team1Stats.win ? "Victory!" : ""}</p>
    <p class="bans-info1">bans:</p>
    <div class="bans bans-team1">
    <img src="${bans[0][0] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[0][0] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
    <img src="${bans[0][1] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[0][1] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
    <img src="${bans[0][2] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[0][2] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
    <img src="${bans[0][3] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[0][3] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
    <img src="${bans[0][4] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[0][4] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
    </div>
    <div class="teamstats">
    <p>Kills: ${team1Stats.kills} <span class="first">${team1Stats.firstBlood ? "First Blood!" : ""}</span></p>
    <p>towers: ${team1Stats.towers} <span class="first">${team1Stats.firstTower ? "First Tower!" : ""}</span></p>
    <p>inhibitors: ${team1Stats.inhibitors}</p>
    <p>drakes: ${team1Stats.dragons}</p>
    <p>heralds: ${team1Stats.heralds}</p>
    <p>barons: ${team1Stats.barons}</p>
    </div>
    </div>
  `)
  let Team2 = NewElement(`
  <div>
  <p class="win win-${team2Stats.win}">${team2Stats.win ? "Victory!" : ""}</p>
  <p class="bans-info2">bans:</p>
  <div class="bans bans-team2">
  <img src="${bans[1][0] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[1][0] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
  <img src="${bans[1][1] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[1][1] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
  <img src="${bans[1][2] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[1][2] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
  <img src="${bans[1][3] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[1][3] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
  <img src="${bans[1][4] != "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/undefined.png" ? bans[1][4] : "https://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/29.png"}" alt="">
  </div>
  <div class="teamstats">
  <p>Kills: ${team2Stats.kills} <span class="first">${team2Stats.firstBlood ? "First Blood!" : ""}</span></p>
  <p>towers: ${team2Stats.towers} <span class="first">${team2Stats.firstTower ? "First Tower!" : ""}</span></p>
  <p>inhibitors: ${team2Stats.inhibitors}</p>
  <p>drakes: ${team2Stats.dragons}</p>
  <p>heralds: ${team2Stats.heralds}</p>
  <p>barons: ${team2Stats.barons}</p>
  </div>
  </div>
  `)
  document.querySelector(".match-details").appendChild(Team1);
  document.querySelector(".match-details").appendChild(Team2);


  HTTPrequest("GET", timelineurl).then(timeline => {
    let playerframes = playerFrames(timeline);
    let frames = timeline.info.frames;
    console.log({ playerframes, frames });

    let redSideTotalGold = teamSum(playerFrames(timeline), "totalGold", 0, 5);
    let blueSideTotalGold = teamSum(playerFrames(timeline), "totalGold", 5, 10);
    let test = blueSideTotalGold.map(x => -x);
    let totalGoldDiffrence = teamDiff(playerFrames(timeline), "totalGold");
    let labels = range(redSideTotalGold.length, 0, 1);
    console.log({ redSideTotalGold, blueSideTotalGold, totalGoldDiffrence, labels });

    let data = {
      type: "line",
      data: {
        datasets: [
          {
            label: "red side gold",
            data: redSideTotalGold,
            borderWidth: 3,
            borderColor: "hsl(358, 94%, 62%)",
            pointStyle: false,
          },
          {
            label: "blue side gold",
            data: test,
            borderWidth: 3,
            borderColor: "hsl(196, 93%, 60%)",
            pointStyle: false,
          },
          {
            label: "gold diffrence",
            data: totalGoldDiffrence,
            borderWidth: 3,
            borderColor: "hsl(150, 49%, 59%)",
            pointStyle: false,
          }
        ],
        labels: range(redSideTotalGold.length, 0, 1)
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            grid:{
              color: "hsl(0, 0%, 96%, 0.25)",
            }
          },
          x: {
            type: 'linear',
            grid:{
              color: "hsl(0, 0%, 96%, 0.25)",
            }
          },
        }
      }
    }

    makeNewChartElement(".match-info-container", "test", data);





    for (let i = 0; i < summoners.length; i++) {
      let matchresult = matchdata.info.participants[i].win;
      let summoner = NewElement(`
    <div class="summoner ${i < 5 ? redSide : blueSide}" id="summoner-${i}">
    <div class="summoner-link">
    <img class="champion-img" id="champion-img-${i}" src="https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${summoners[i].championName}.png" alt="">
        <p class="champion-name" id="champion-name-${i}">${summoners[i].championName}</p>
        <p class="summoner-name" id="summoner-name-${i}">
        <a id="summoner-link-${i}" href="results.html?region=EUN1&summonername=${summoners[i].summonerName}">${summoners[i].summonerName}</a>
        </p>
      </div>
      <button class="stats-btn" id="summoner-stats-btn-${i}">&#10140</button>
      </div>  
      `);

      let summonerContainer = document.querySelector(".match-summoners-container");
      summonerContainer.appendChild(summoner);

      document.querySelector(`#summoner-stats-btn-${i}`).addEventListener("click", (event) => {
        let items = [
          summoners[i].item0,
          summoners[i].item1,
          summoners[i].item2,
          summoners[i].item3,
          summoners[i].item4,
          summoners[i].item5
        ]
        let runes = {
          main: {
            row1: findRune(summoners[i].perks.styles[0].selections[0].perk, runesData),
            row2: findRune(summoners[i].perks.styles[0].selections[1].perk, runesData),
            row3: findRune(summoners[i].perks.styles[0].selections[2].perk, runesData),
            row4: findRune(summoners[i].perks.styles[0].selections[3].perk, runesData),
          },
          secondary: {
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
          farm: function () {
            return this.totalMinionsKilled + this.neutralMinionsKilled
          },
        }
        let statsDiv = NewElement(`
      <div class="summoner-stats-container-child">
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
        document.querySelector(".summoner-stats-container").innerHTML = "";
        document.querySelector(".summoner-stats-container").appendChild(statsDiv);
        document.querySelector(".chart-container").innerHTML = "";

      })
    }
  })
})

function champIdToName(champId, champData) {
  let keys = Object.keys(champData.data);
  for (let i = 0; i < keys.length; i++) {
    if (champData.data[keys[i]].key == champId)
      return keys[i];
  }
}

function teamSum(frames, path, firstPlayer, lastPlayer) {
  let output;
  let team1 = new Array(frames[0].length);
  team1.fill(0)
  for (let player = firstPlayer; player < lastPlayer; player++) {
    let temp = getFromObject(frames[player], path)
    for (let frame = 0; frame < temp.length; frame++) {
      team1[frame] += temp[frame]
    }
  }
  output = team1;
  return output;
}

function teamDiff(frames, path) {
  let team1 = new Array(frames[0].length);
  let team2 = new Array(frames[0].length);
  team1.fill(0)
  team2.fill(0)
  for (let player = 0; player < 5; player++) {
    let temp = getFromObject(frames[player], path)
    for (let frame = 0; frame < temp.length; frame++) {
      team1[frame] += temp[frame]
    }
  }
  for (let player = 5; player < 10; player++) {
    let temp = getFromObject(frames[player], path)
    for (let frame = 0; frame < temp.length; frame++) {
      team2[frame] += temp[frame]
    }
  }
  let diff = new Array(team1.length)
  diff.fill(0)
  let x = diff.map((x, index) => team1[index] - team2[index])
  return x;
}

function getFromObject(obj, path) {
  let keys = path.split(".");
  let output = new Array();
  let temp;
  for (let frame = 0; frame < obj.length; frame++) {
    //console.log(obj[frame]);
    temp = obj[frame];
    for (let key = 0; key < keys.length; key++) {
      temp = temp[keys[key]];
    }
    output.push(temp);
  }
  return output;
}


function playerFrames(timeline) {
  let frames = timeline.info.frames;
  let playerCount = 10;
  let output = new Array();
  for (let player = 1; player <= playerCount; player++) {
    output[player - 1] = new Array();
    for (let frame = 0; frame < frames.length; frame++) {
      output[player - 1].push(frames[frame].participantFrames[player]);
    }
  }
  return output;
}


function findRune(runeId, runesJson) {
  let output;
  for (let i = 0; i < runesJson.length; i++) {
    for (let ii = 0; ii < runesJson[i].slots.length; ii++) {
      runesJson[i].slots[ii].runes.find(childElement => {
        if (childElement.id == runeId) {
          output = childElement;
        };
      })
    }
  }
  return output;
}

function range(length, start, step) {
  let labels = []
  for (let i = start; i < start + length * step; i += step) {
    labels.push(i);
  }
  return labels;
}


function makeNewChartElement(containerClass, chartId, data) {
  let container = document.querySelector(containerClass);
  let chartElement = NewElement(`
    <div class="chart-container-child">
      <canvas id="${chartId}"></canvas>
    </div> 
  `);
  container.appendChild(chartElement);
  new Chart(chartId, data);
}
