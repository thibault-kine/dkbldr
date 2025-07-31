import { Card, Cards } from "scryfall-api";
import { getSeedFromDate, seededRandom } from "../utils/utils";


export type CardEntry = { qty: number; card: Card };

export type CardType = {
    id: string;
    name: string;
    scryfall_uri: string;
    layout: "normal" 
            | "split" 
            | "flip" 
            | "transform" 
            | "modal_dfc" 
            | "meld" 
            | "leveler"
            | "class"
            | "case"
            | "saga" 
            | "adventure" 
            | "mutate" 
            | "prototype" 
            | "battle";
    image_uris?: { png: string; art_crop: string };
    mana_cost: string;
    cmc: number;
    type_line: string;
    oracle_text: string;
    power: string; toughness: string;
    colors: string[];
    color_identity: string[];
    keywords: string[];
    game_changer: boolean;
    rulings_uri: string;
    collector_number: string;
    set: string;
}


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


export async function getRandomCommander(tzOffset = 60): Promise<Card> {
    try {
        const now = new Date();
        now.setMinutes(now.getMinutes() + tzOffset);
        const seed = getSeedFromDate(now);
        const rnd = seededRandom(seed);

        const res = await fetch("https://api.scryfall.com/cards/random?q=legal:edh is:commander -t:background -otag:synergy-sticker", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!res.ok) throw new Error("Erreur Scryfall: " + res.status);
        const card = await res.json();

        return card as Card;
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


export async function getAllPrints(card: Card): Promise<Card[]> {
    try {
        const res = await fetch(card.prints_search_uri);
        const data = await res.json();
        return data.data;
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}