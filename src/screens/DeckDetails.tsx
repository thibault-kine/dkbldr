import { Box, Typography } from "@mui/joy"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Deck, DeckList, getDeckById } from "../../db/decks";
import Loading from "../components/Loading";
import { Card } from "scryfall-api";

export default function DeckDetails() {

    const { id } = useParams();
    const [deck, setDeck] = useState<Deck | null>(null);


    const CARD_TYPES = [
        "Commander", "Creature", "Artifact", 
        "Enchantment", "Instant", "Sorcery", 
        "Planeswalker", "Battle", "Land" 
    ];

    function groupCardsByType(deck: Deck) {
        const groups: Record<string, Card[]> = {};
        for (const type of CARD_TYPES) {
            groups[type] = [];
        }

        console.log(groups);

        deck.deckList.forEach((entry, index) => {
            const { card } = entry;
            const typeline = card.card_faces?.[0].type_line ?? card.type_line;
            const isCreature = typeline.includes("Creature");
            const isLand = typeline.includes("Land");

            let commanders: typeof deck.commanders = [];
            {
                const potentialCommanders = deck.deckList.slice(-2); // les 3 dernières cartes
    
                const isCommanderType = (card: Card) => {
                    const t = card.type_line;
                    return (
                        card.legalities.commander === "legal" && (
                        t.includes("Legendary") ||
                        t.includes("Background") ||
                        card.oracle_text?.includes("can be your commander")
                    ));
                };
    
                const validCandidates = potentialCommanders.filter(entry => isCommanderType(entry.card));
    
                if (validCandidates.length === 1) {
                    commanders = [validCandidates[0].card];
                } else if (validCandidates.length >= 2) {
                    const background = validCandidates.find(e => e.card.type_line.includes("Background"));
                    const creature = validCandidates.find(e => e.card.type_line.includes("Legendary Creature"));
    
                    if (background && creature) {
                        commanders = [creature.card, background.card];
                    } else {
                        // Par défaut, on prend la dernière carte légendaire/commandable
                        const last = [...validCandidates].reverse().find(e => isCommanderType(e.card));
                        if (last) commanders = [last.card];
                    }
                }
    
                groups.Commander = commanders;
            }

            if (isCreature && !commanders.includes(entry.card))
                groups.Creature.push(entry.card);
            else if (isLand)
                groups.Land.push(entry.card);
            else if (typeline.includes("Artifact"))      groups.Artifact.push(entry.card);
            else if (typeline.includes("Enchantment"))   groups.Enchantment.push(entry.card);
            else if (typeline.includes("Instant"))       groups.Instant.push(entry.card);
            else if (typeline.includes("Sorcery"))       groups.Sorcery.push(entry.card);
            else if (typeline.includes("Planeswalker"))  groups.Planeswalker.push(entry.card);
            else if (typeline.includes("Battle"))        groups.Battle.push(entry.card);
        })

        return groups;
    }


    useEffect(() => {
        async function fetchDeck() {
            if (!id) return;
            try {
                const deckData = await getDeckById(id);
                setDeck({...deckData});
            }
            catch (error) {
                console.error("Erreur lors de la récupération du deck: ", error);
            }
        } 
        fetchDeck();
    }, [deck]);


    if (!deck) return <Loading/>

    return (
        <Box>
            <Typography>{deck.name}</Typography>
        </Box>
    )
}