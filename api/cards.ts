import axios from "axios";

const URL = "https://api.scryfall.com/cards";


export async function getRandomCard() {
    try {
        const res = await axios.get(`${URL}/random`);
        return res.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getRandomCommander() {
    try {
        //                                           legal:edh   is:commander
        const res = await axios.get(`${URL}/search?q=legal%3Aedh+is%3Acommander`);
        const randomIndex = Math.floor(Math.random() * res.data.data.length);
        return res.data.data[randomIndex];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


export async function searchCard(query: String) {
    try {
        const parsed = query.split(" ").join("+");
        const res = await axios.get(`${URL}/named?fuzzy=${parsed}`);
        return res.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}