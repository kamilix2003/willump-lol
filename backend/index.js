import {fetch, Request, Response} from 'undici';
import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();
const app = express();
const port = process.env.PORT;
const api_key = process.env.API_KEY;
app.use(cors());
app.use(express.urlencoded({ extended: true }));

await mongoose.connect('mongodb://127.0.0.1/my_database');

const playerData = new mongoose.Schema({
    name: { type: String, default: 'summoner'}
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
