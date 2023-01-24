import {fetch, Request, Response} from 'undici';
import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";
import mongoose, { Schema } from 'mongoose';
import e from 'express';
mongoose.set('strictQuery', true);
dotenv.config();
const app = express();
const port = process.env.PORT;
const api_key = process.env.API_KEY;
const atlas_url = process.env.ATLAS;
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(atlas_url)

const playerSchema = new Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 18,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    searchedAt: {
        type: Date,
        default: () => Date.now()
    },
    // kills: {type: Number, default: 0},
    // deaths: {type: Number, default: 0},
    // assists: {type: Number, default: 0},
    // wins: {type: Number, default: 0},
    // loses: {type: Number, default: 0},
    matches: {
        type: [Schema.Types.Mixed]
    },
    
});



const Player = mongoose.model("player", playerSchema);

app.get('/api/riotapirequest', (req, res) => {
    let url = req.query.url + "api_key="+api_key;
    // res.send(url);
    // console.log(`request ${url}`)
    fetch(url)
        .then(res => res.json())
        .then(data => res.send(data))
})

app.get('/api/getsummoner', (req,res) => {
    let url = `https://${req.query.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.query.name}?api_key=${api_key}`
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.summonerLevel > 0)
                addNewPlayerToDb(req.query.name);
            
            res.send(data)
        })
})

app.get('/api/getmatchhistory', (req,res) => {
    let ids = `${req.query.startTime != undefined ? `startTime=${req.query.startTime}&` : "" }${req.query.endTime != undefined ? `endTime=${req.query.endTime}&` : "" }${req.query.queue != undefined ? `queue=${req.query.queue}&` : "" }${req.query.type != undefined ? `type=${req.query.type}&` : "" }${req.query.start != undefined ? `start=${req.query.start}&` : "" }${req.query.count != undefined ? `count=${req.query.count}&` : "" }`
    let url = `https://${req.query.continent}.api.riotgames.com/lol/match/v5/matches/by-puuid/${req.query.puuid}/ids?${ids}api_key=${api_key}`
    let summonerName = req.query.name;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // addMatchId(summonerName, data)
            // console.log(summonerName, data);
            res.send(data);
        })
})

app.get('/api/getmatchdata', (req,res) => {
    let url = `https://${req.query.continent}.api.riotgames.com/lol/match/v5/matches/${req.query.id}?api_key=${api_key}`
    let summonerName = req.query.name
    let matchId = req.query.id
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(async data => {
            res.send(data)
            // await Player.exists({name: summonerName}, () => {
            //     addMatchId(summonerName, data, matchId);
            // })
            addMatchId(summonerName, data, matchId);
        })
})

app.get('/api/getmatchtimeline', (req,res) => {
    let url = `https://${req.query.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.query.name}?api_key=${api_key}`
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => res.send(data))
})

app.get('/api/getplayerstats',async (req,res) => {
    let stats = {
        wins: 0,
        loses: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        count: 0,
    }
    try{
        const player = await Player.findOne({name: req.query.name.toLowerCase()})
    player.matches.forEach((element, index) => {
        element.stats.win ? stats.wins++ : stats.loses++;
        stats.kills += element.stats.kills;
        stats.deaths += element.stats.deaths;
        stats.assists += element.stats.assists;
        stats.count < index+1 ? stats.count = index+1 : 0;
    })
    }
    catch (e) {
        console.log(e);
    }
    res.send(stats);
})

app.listen(port)

async function addMatchId(name, data, matchId){
    try {
        let playerStats = data.info.participants;
        let playerIndex = playerStats.findIndex(obj => obj.summonerName == name)
        const player = await Player.findOne({name: name.toLowerCase()})
            if(player.matches.findIndex(obj => obj.id == matchId) === -1){
                console.log(`new match: ${matchId}`);
                let match = {
                    id: matchId,
                    stats: playerStats[playerIndex]
                }
                player.matches.push(match);
            }
        // console.log(player.matches)
        await player.save();
    }
    catch (e){
        console.log(e)
    }
}

async function addNewPlayerToDb(name){
    try {
        const player = await Player.exists({name: name.toLowerCase()})
        if(!player){
            const newPlayer = new Player({name: name.toLowerCase()});
            newPlayer.save().then(() => console.log(`New user: ${newPlayer.name.toLowerCase()}`));
        }
    }
    catch (e) {
        console.log(e);
    }
}