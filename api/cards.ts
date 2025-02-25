import axios, { all } from "axios";
import { Card, Cards } from "scryfall-api";


export async function getAllCards(query: string) {
    try {
        const res = await Cards.search(query).all();
        return res;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getRandomCard(): Promise<Card> {
    try {
        const res = await Cards.random();
        return res;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getRandomCommander(): Promise< Card > {
    try {
        const allCommanders = await getAllCards("legal:edh is:commander");
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


export async function searchCard(query: string) {
    try {
        const res = await Cards.byName(query, true);
        return res;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getCardById(id: number) {
    try {
        const res = await Cards.byId(id.toString());
        return res;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}