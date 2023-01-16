import {fetch, Request, Response} from 'undici';
import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
const api_key = process.env.API_KEY;
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let data = await fetch("https://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/champion.json").then(res => {
    return res.json();
})

app.get('/', (req, res,) => {
    res.send(data);
})

app.get('/riotapirequest', (req, res) => {
    let url = req.query.url + "api_key="+api_key;
    // res.send(url);
    // console.log(`request ${url}`)
    fetch(url)
        .then(res => res.json())
        .then(data => res.send(data))
})

app.listen(port)
