import {fetch, Request, Response} from 'undici';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());

let data = await fetch("https://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/champion.json").then(res => {
    return res.json();
})

app.get('/', (req, res,) => {
    res.send(data);
})

app.listen(port)
