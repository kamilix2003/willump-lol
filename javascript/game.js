import { parseURLParams, NewElement, askForApiKey, regions, getCurrentVersion, unixToDate, checkUrl, dev } from "./func.js";

// askForApiKey();
// const API_KEY = sessionStorage.getItem("API_KEY");

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  loader.classList.add("loaded");
})

const redSide = "red-side";
const blueSide = "blue-side";

let api_url = checkUrl();

const currentVersion = await getCurrentVersion();

let urlData = parseURLParams(window.location.href);

let regionId = urlData.matchid[0].split("_")[0];
let continent = regions[regionId].continent;

//let matchurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}?`;
let matchurl = `${dev ? "http" : "https"}://${api_url}/getmatchdata?continent=${continent}&id=${urlData.matchid}`;
//let timelineurl = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${urlData.matchid}/timeline?`;
let timelineurl = `${dev ? "http" : "https"}://${api_url}/getmatchdata?continent=${continent}&id=${urlData.matchid}/timeline`;
let runesurl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/runesReforged.json`;
let championurl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/champion.json`;
let itemsurl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/item.json`;
let spellsurl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/summoner.json`;

let spellsData = await fetch(spellsurl).then(res => {
    return res.json();
});

let runesData = await fetch(runesurl).then(res => {
  return res.json();
});

let championData = await fetch(championurl).then(res => {
  return res.json();
})

let itemsData = await fetch(itemsurl).then(res => {
  return res.json();
})

console.log({matchurl, timelineurl, runesurl, championurl, itemsurl});

let counter = 0;

let prevSummoner;

fetch(matchurl)
.then(res => res.json())
.then(matchdata => {
  let summoners = matchdata.info.participants;
  let date = unixToDate(matchdata.info.gameCreation)
  document.querySelector("#date").innerHTML = `${date}`;
  console.log({ matchdata, summoners });

  let bans;
  if (matchdata.info.teams[0].bans != 0) {
    bans = [
      [
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[0].bans[0].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[0].bans[1].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[0].bans[2].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[0].bans[3].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[0].bans[4].championId, championData)}.png`,
      ],
      [
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[1].bans[0].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[1].bans[1].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[1].bans[2].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[1].bans[3].championId, championData)}.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champIdToName(matchdata.info.teams[1].bans[4].championId, championData)}.png`,
      ]
    ]
  } else {
    bans = [
      [
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
      ],
      [
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
        `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`,
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
    <div class="match-details">
    <p class="win win-${team1Stats.win}">${team1Stats.win ? "Victory!" : ""}</p>
    <p class="bans-info1">bans:</p>
    <div class="bans bans-${summoners[0].teamId == 200 ? "blue" : "red"}">
    <img src="${bans[0][0] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[0][0] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
    <img src="${bans[0][1] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[0][1] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
    <img src="${bans[0][2] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[0][2] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
    <img src="${bans[0][3] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[0][3] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
    <img src="${bans[0][4] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[0][4] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
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
  <div class="match-details">
  <p class="win win-${team2Stats.win}">${team2Stats.win ? "Victory!" : ""}</p>
  <p class="bans-info2">bans:</p>
  <div class="bans bans-${summoners[9].teamId == 200 ? "blue" : "red"}">
  <img src="${bans[1][0] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[1][0] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
  <img src="${bans[1][1] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[1][1] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
  <img src="${bans[1][2] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[1][2] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
  <img src="${bans[1][3] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[1][3] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
  <img src="${bans[1][4] != `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/undefined.png` ? bans[1][4] : `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/profileicon/29.png`}" alt="">
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
  document.querySelector(".grid-container").prepend(Team1);
  document.querySelector(".grid-container").prepend(Team2);


  fetch(timelineurl)
  .then(res => res.json())
  .then(timeline => {
    let playerframes = playerFrames(timeline);
    let frames = timeline.info.frames;
    // console.log({ playerframes, frames });

    let redSideTotalGold = teamSum(playerFrames(timeline), "totalGold", 0, 5);
    let blueSideTotalGold = teamSum(playerFrames(timeline), "totalGold", 5, 10);
    let totalGoldDiffrence = teamDiff(playerFrames(timeline), "totalGold");
    let pieChartData = pieChart(matchdata, "goldEarned");
    let dmgChartData = pieChart(matchdata, "totalDamageDealtToChampions");
    let labels = range(redSideTotalGold.length, 0, 1);
    // console.log({ redSideTotalGold, blueSideTotalGold, totalGoldDiffrence,pieChartData,dmgChartData, labels });
    let tooltipcounter = 0;
    const footer = (tooltipItems) => {
      let output = 
      `red side total gold: ${redSideTotalGold[tooltipItems[0].dataIndex]}
blue side total gold: ${blueSideTotalGold[tooltipItems[0].dataIndex]}`
      return output;
    };

    let dataTeamDiff = {
      type: "line",
      data: {
        datasets: [
          {
            label: "gold diffrence",
            data: totalGoldDiffrence,
            borderWidth: 2,
            borderColor: "hsl(150, 49%, 59%)",
            pointStyle: false,
            fill: {
              target: {value: 0},
              above: summoners[0].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)", 
              below: summoners[9].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
            },
          }
        ],
        labels: range(redSideTotalGold.length, 0, 1)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            grid: {
              color: "hsl(0, 0%, 96%, 0.25)",
            }
          },
          x: {
            type: 'linear',
            grid: {
              color: "hsl(0, 0%, 96%, 0.25)",
            }
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          tooltip: {
            callbacks: {
              footer: footer,
            }
          }
        }
      }
    }

    let dataDamage = {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Damage dealt to champions",
            data: dmgChartData[1],
            borderWidth: 3,
            backgroundColor: [
              summoners[0].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[1].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[2].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[3].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[4].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[5].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[6].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[7].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[8].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
              summoners[9].teamId == 100 ? "hsl(196, 93%, 60%, 0.5)" : "hsl(358, 94%, 62%, 0.5)",
            ],
            borderColor: [
              summoners[0].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[1].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[2].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[3].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[4].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[5].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[6].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[7].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[8].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
              summoners[9].teamId == 100 ? "hsl(196, 93%, 60%)" : "hsl(358, 94%, 62%)",
            ],
            pointStyle: false,
          }
        ],
        labels: dmgChartData[0]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
        }
      }
    }

    document.querySelector(".grid-container").appendChild(NewElement(`
    <div class="match-chart-container"></div>
    `))
    makeNewChartElement(".match-chart-container", "golddiff", dataTeamDiff);
    makeNewChartElement(".match-chart-container", "dmgdealt", dataDamage);
    document.querySelector(".match-chart-container .chart-container-child").style.width = "100%";




    for (let i = 0; i < summoners.length; i++) {
      let matchresult = matchdata.info.participants[i].win;
      let summoner = NewElement(`
    <div class="summoner ${summoners[i].teamId == 100 ? blueSide : redSide}" id="summoner-${i}">
    <div class="summoner-link">
    <img class="champion-img" id="champion-img-${i}" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${summoners[i].championName}.png" alt="">
        <p class="champion-name" id="champion-name-${i}">
        <a href="https://leagueoflegends.fandom.com/wiki/${summoners[i].championName}/LoL"$>${summoners[i].championName}</a>
        </p>
        <p class="summoner-name" id="summoner-name-${i}">
        <a id="summoner-link-${i}" href="${dev ? "results.html" : "https://willump.lol/matchhistory"}?region=${regionId}&summonername=${summoners[i].summonerName}">${summoners[i].summonerName}</a>
        </p>
      </div>
      <button class="stats-btn" id="summoner-stats-btn-${i}">&#10140</button>
      </div>  
      `);

      let summonerContainer = document.querySelector(".match-summoners-container");
      summonerContainer.appendChild(summoner);

      document.querySelector(`#summoner-stats-btn-${i}`).addEventListener("click", (event) => {
        if(prevSummoner != undefined){
          document.querySelector(`#summoner-stats-btn-${prevSummoner}`).classList.remove("selected");
        }
        document.querySelector(`#summoner-stats-btn-${i}`).classList.add("selected");
        prevSummoner = i;
        let summonerSpells = [
          getSummonerSpell(summoners[i].summoner1Id, spellsData),
          getSummonerSpell(summoners[i].summoner2Id, spellsData),,
        ]
        // console.log(summonerSpells)
        let items = [
          itemsData.data[summoners[i].item0] != null ? itemsData.data[summoners[i].item0] : "",
          itemsData.data[summoners[i].item1] != null ? itemsData.data[summoners[i].item1] : "",
          itemsData.data[summoners[i].item2] != null ? itemsData.data[summoners[i].item2] : "",
          itemsData.data[summoners[i].item3] != null ? itemsData.data[summoners[i].item3] : "",
          itemsData.data[summoners[i].item4] != null ? itemsData.data[summoners[i].item4] : "",
          itemsData.data[summoners[i].item5] != null ? itemsData.data[summoners[i].item5] : ""
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
        // console.log({runes, items});
        let statsDiv = NewElement(`
      <div class="summoner-stats-container-child">
      <div class="stats">
      <p>kda: ${stats.kills}/${stats.deaths}/${stats.assists}</p>
      <p>dmg dealt: ${stats.damageDealt}</p>
      <p>dmg taken: ${stats.damageTaken}</p>
      <p>vision score: ${stats.visionScore}</p>
      <p>farm: ${stats.farm()}</p>
      </div>
      <div class="stats-wrapper">
      <div class="items">
          ${items[0] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[0].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[0].image.full}" alt=""></a>` : ""}
          ${items[1] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[1].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[1].image.full}" alt=""></a>` : ""}
          ${items[2] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[2].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[2].image.full}" alt=""></a>` : ""}
          ${items[3] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[3].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[3].image.full}" alt=""></a>` : ""}
          ${items[4] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[4].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[4].image.full}" alt=""></a>` : ""}
          ${items[5] != "" ? `<a href="https://leagueoflegends.fandom.com/wiki/${items[5].name.replaceAll(" ", "_")}"> <img class="item-icon" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${items[5].image.full}" alt=""></a>` : ""}
      </div>
      <div class="summoner-spells">
      <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpells[0].image.full}" alt="">
      <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/spell/${summonerSpells[1].image.full}" alt="">
      </div>
      </div>
      <div class="runes">
          <img class="rune-icon rune-icon-main" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.main.row1.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.main.row1.name.replaceAll(" ","_")}`}"> ${runes.main.row1.name} </a> </p>
          <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.main.row2.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.main.row2.name.replaceAll(" ","_")}`}"> ${runes.main.row2.name} </a> </p>
          <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.main.row3.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.main.row3.name.replaceAll(" ","_")}`}"> ${runes.main.row3.name} </a> </p>
          <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.main.row4.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.main.row4.name.replaceAll(" ","_")}`}"> ${runes.main.row4.name} </a> </p>
          <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.secondary.row1.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.secondary.row1.name.replaceAll(" ","_")}`}"> ${runes.secondary.row1.name} </a> </p>
          <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${runes.secondary.row2.icon}" alt="">
          <p class="rune-name"> <a href="${`https://leagueoflegends.fandom.com/wiki/${runes.secondary.row2.name.replaceAll(" ","_")}`}"> ${runes.secondary.row2.name} </a> </p>
        </div>
      </div>
      `)
        document.querySelector(".summoner-stats-container").innerHTML = "";
        document.querySelector(".summoner-stats-container").appendChild(statsDiv);
        if(document.querySelector(".add-chart") == undefined){
          document.querySelector(".grid-container").append(NewElement(`
          <div class="add-chart">
            <button class="add-chart-btn">add chart</button>
            <select name="chart-data" class="chart-data"></select>
            <button class="remove-all-charts-btn">&#128465</button>
          </div>
          `));
          }else{
            document.querySelector(".add-chart").remove();
            document.querySelector(".grid-container").appendChild(NewElement(`
            <div class="add-chart">
              <button class="add-chart-btn">add chart</button>
              <select name="chart-data" class="chart-data"></select>
              <button class="remove-all-charts-btn">&#128465</button>
            </div>
            `));
          }

        let selectorOptions = `
        <optgroup label="Champion stats">
          <option value="championStats.abilityPower"> ability power </option>
          <option value="championStats.armor"> armor </option>
          <option value="championStats.attackDamage"> atack damage </option>
          <option value="championStats.attackSpeed"> atack speed </option>
          <option value="championStats.healthMax"> health </option>
          <option value="championStats.magicResist"> magic resistance </option>
          <option value="championStats.powerMax"> mana </option>
        </optgroup>
        <optgroup label="Damage stats">
          <option value="damageStats.magicDamageDone"> total magic damage done </option>
          <option value="damageStats.magicDamageDoneToChampions"> magic damage done to champions </option>
          <option value="damageStats.magicDamageTaken"> magic damage taken </option>
          <option value="damageStats.physicalDamageDone"> total physical damage done </option>
          <option value="damageStats.physicalDamageDoneToChampions"> physical damage done to champions </option>
          <option value="damageStats.physicalDamageTaken"> physical damage taken </option>
          <option value="damageStats.totalDamageDone"> total damage done </option>
          <option value="damageStats.totalDamageDoneToChampions"> damage done to champions </option>
          <option value="damageStats.totalDamageTaken"> damage taken </option>
          <option value="damageStats.trueDamageDone"> total true damage done </option>
          <option value="damageStats.trueDamageDoneToChampions"> true damage done to champions </option>
          <option value="damageStats.trueDamageTaken"> true damage taken </option>
        </optgroup>
        <optgroup label="General stats">
          <option value="jungleMinionsKilled"> monsters killed </option>
          <option value="minionsKilled"> minions killed </option>
          <option value="level"> level </option>
          <option value="xp"> experience </option>
          <option selected="selected" value="totalGold"> gold </option>
          <option value="timeEnemySpentControlled"> inflicted CC time </option>
        </optgroup>
        `;
        document.querySelector(".chart-data").innerHTML = selectorOptions;
        document.querySelector(".remove-all-charts-btn").addEventListener("click", () => {
          document.querySelector(".chart-container").innerHTML = "";
        })
        document.querySelector(".add-chart-btn").addEventListener("click", () => {
          counter++;
          let color = summoners[i].teamId == 100 ? "196, 93%, 60%" : "358, 94%, 62%";
          let selector = document.querySelector(".chart-data")
          let chartData = {
            type: "line",
            data: {
              datasets: [
                {
                  label: selector.options[selector.selectedIndex].label,
                  data: getFromObject(playerframes[i], selector.value),
                  borderWidth: 3,
                  borderColor: `hsl(${color})`,
                  pointStyle: false,
                  fill: {
                    target: {value: 0},
                    above: `hsl(${color}, 0.5)`,
                  }
                },
              ],
              labels: range(redSideTotalGold.length, 0, 1)
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  type: 'linear',
                  grid: {
                    color: "hsl(0, 0%, 96%, 0.25)",
                  }
                },
                x: {
                  type: 'linear',
                  grid: {
                    color: "hsl(0, 0%, 96%, 0.25)",
                  }
                },
                
              }
            }
          }
          if(document.querySelector(`#chart-${selector.options[selector.selectedIndex].label.replaceAll(" ", "-")}-${summoners[i].championName}`) == undefined){
            makeNewChartElement(`.chart-container`, `chart-${selector.options[selector.selectedIndex].label.replaceAll(" ", "-")}-${summoners[i].championName}`, chartData)
            let championNameForChart = NewElement(`
              <div class="chart-champion-info">
                <img src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${summoners[i].championName}.png" alt="">
                <p> ${summoners[i].championName} </p>
              </div>
            `)
            document.querySelector(`#chart-${selector.options[selector.selectedIndex].label.replaceAll(" ", "-")}-${summoners[i].championName}`).parentNode.prepend(championNameForChart)
        };
        })
      })
    }
  }) 
})


function playerChart(chartIndex, selectorOptions){
  return `
  <div class="blank-player-chart player-chart-${chartIndex}">
      <select name="chartData" class="chart-data-selector chart-data-selector-${chartIndex}">
        ${selectorOptions}
      </select>
      <button class="player-chart-button  player-chart-button-${chartIndex}"> chart ${chartIndex} </button>
    </div>        
  `
}

function pieChart(matchData, path){
  let output = [];
  output[0] = new Array();
  output[1] = new Array();
  for(let player = 0; player < 10; player++){
    output[0][player] = matchData.info.participants[player].championName;
    output[1][player] = matchData.info.participants[player][path];
  }
  return output;
}

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


function makeNewChartElement(containerClass, chartId, data, width = "25em", height = "15em") {
  let container = document.querySelector(containerClass);
  let chartElement = NewElement(`
    <div class="chart-container-child">
      <canvas class="chart" id="${chartId}"></canvas>
    </div> 
  `);
  container.appendChild(chartElement);
  new Chart(chartId, data);
}

function getSummonerSpell(spellId, spellsData){
  let keys = Object.keys(spellsData.data);
  let output;
  keys.map(key => {
      spellsData.data[key].key == spellId ? output = spellsData.data[key] : "nope";
  })

  return output;
}