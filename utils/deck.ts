import { Card } from "scryfall-api";
import { DeckList } from "../src/services/api";

export function groupCardsByType(deckList: DeckList) {

    const CARD_GROUPS = [
        "Commander", "Creature", "Artifact", 
        "Enchantment", "Instant", "Sorcery", 
        "Planeswalker", "Battle", "Land" 
    ];

    const groups: Record<string, { card: Card, qty: number }[]> = {};
    CARD_GROUPS.forEach(type => groups[type] = []);

    const isCommander = (card: Card) => {
        const t = card.type_line;
        const text = card.oracle_text ?? "";

        const releaseDate = Date.parse(new Date(card.released_at).toDateString());
        const today = Date.now();

        return (
            (card.legalities.commander === "legal" || today <= releaseDate) &&
            (
                t.includes("Legendary") ||
                t.includes("Background") ||
                text.includes("can be your commander") ||
                text.includes("Partner")
            )
        );
    };


    let commanders: { card: Card; qty: number }[] = [];
    // Get last 5 entries to account for partners, backgrounds, etc.
    const potential = deckList.slice(-5).filter(e => isCommander(e.card));

    // Case: Background + Creature (still legal combo)
    const background = potential.find(e => e.card.type_line.includes("Background"));
    const legendaryCreature = potential.find(e => e.card.type_line.includes("Legendary Creature"));

    if (background && legendaryCreature) {
        commanders = [legendaryCreature, background];
    } else {
        // Check if multiple cards have "Partner" or "Partner with"
        const partners = potential.filter(e => e.card.oracle_text?.includes("Partner"));
        if (partners.length >= 2) {
            commanders = partners.slice(0, 2); // pick 2 if found
        } else if (potential.length > 0) {
            // fallback: take most recent single commander-looking card
            commanders = [potential[potential.length - 1]];
        }
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