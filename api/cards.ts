import axios, { all } from "axios";

const URL = "https://api.scryfall.com/cards";


export async function getAllCards(query: string) {
    let allCards: any[] = [];
    let parsed = query.split(" ").join("+");
    let url: (string | null) = `${URL}/search?q=${parsed}`;

    try {
        while (url) {
            const res = await axios.get(url);
            allCards = [...allCards, ...res.data.data];

            if (res.data.has_more)
                url = res.data.next_page;
            else
                url = null;
        }

        return allCards;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


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
        const allCommanders = await getAllCards("legal%3Aedh+is%3Acommander");
        if (allCommanders.length === 0)
            throw new Error("No commander found!");

        const randomIndex = Math.floor(Math.random() * allCommanders.length);
        return allCommanders[randomIndex];
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