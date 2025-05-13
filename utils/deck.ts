import { Card } from "scryfall-api";
import { DeckList } from "../db/decks";

export function groupCardsByType(deckList: DeckList) {

    const CARD_TYPES = [
        "Commander", "Creature", "Artifact", 
        "Enchantment", "Instant", "Sorcery", 
        "Planeswalker", "Battle", "Land" 
    ];

    const groups: Record<string, { card: Card, qty: number }[]> = {};
    CARD_TYPES.forEach(type => groups[type] = []);

    const isCommander = (card: Card) => {
        const t = card.type_line;
        return (
            card.legalities.commander === "legal" && 
            (t.includes("Legendary") || t.includes("Background") || card.oracle_text?.includes("can be your commander"))
        );
    }

    let commanders: { card: Card; qty: number }[] = [];
    const potential = deckList.slice(-2).filter(e => isCommander(e.card));
    if (potential.length === 1) commanders = [potential[0]];
    else if (potential.length >= 2) {
        const background = potential.find(e => e.card.type_line.includes("Background"));
        const creature = potential.find(e => e.card.type_line.includes("Legendary Creature"));

        if (background && creature) commanders = [creature, background];
        else commanders = [potential.reverse()[0]];
    }

    groups.Commander = commanders;

    
    for (const entry of deckList) {
        const { card, qty } = entry;
        if (commanders.find(cmdr => cmdr.card.name === card.name)) continue;

        const typeline = card.card_faces?.[0].type_line ?? card.type_line;

        if (typeline.includes("Creature")) groups.Creature.push(entry);
        else if (typeline.includes("Land")) groups.Land.push(entry);
        else if (typeline.includes("Artifact")) groups.Artifact.push(entry);
        else if (typeline.includes("Enchantment")) groups.Enchantment.push(entry);
        else if (typeline.includes("Instant")) groups.Instant.push(entry);
        else if (typeline.includes("Sorcery")) groups.Sorcery.push(entry);
        else if (typeline.includes("Planeswalker")) groups.Planeswalker.push(entry);
        else if (typeline.includes("Battle")) groups.Battle.push(entry);
    }

    
    return groups;
}