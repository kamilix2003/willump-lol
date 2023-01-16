import {fetch, Request, Response} from 'undici';
import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
dotenv.config();
const app = express();
const port = process.env.PORT;
const api_key = process.env.API_KEY;
app.use(cors());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost/testdb', () => console.log("connected"));

const playerData = new mongoose.Schema({
    name: String,
    matches: String
});

const Player = mongoose.model("Player", playerData);

const testuser = new Player({ name: "test", matches: "asdf;jk"})
await testuser.save();
console.log(testuser);

app.get('/riotapirequest', (req, res) => {
    let url = req.query.url + "api_key="+api_key;
    // res.send(url);
    // console.log(`request ${url}`)
    fetch(url)
        .then(res => res.json())
        .then(data => res.send(data))
})

app.listen(port)
