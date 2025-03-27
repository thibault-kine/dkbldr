import { ContentPaste, ContentPasteGo } from "@mui/icons-material";
import { Button } from "@mui/joy";
import React from "react";


export default function ExportDeck({ decklist }: { decklist: string }) {
    
    function parseDecklist() {
        const sections = decklist.split("\n\n");

        const mainDeck = sections[0]?.split("\n").filter(line => line.trim() !== "") || [];
        const commander = sections[1]?.split("\n").filter(line => line.trim() !== "") || [];
        const sideboard = sections[2]?.split("\n").filter(line => line.trim() !== "") || [];
    
        const formatSection = (lines: string[]) => lines.map(line => line.replace(/^(\d+)\s+/, "$1 ")).join("\n");

        return [
            formatSection(mainDeck),
            commander.length > 0 ? formatSection(commander) : "",
            sideboard.length > 0 ? formatSection(sideboard) : "",
        ].filter(section => section !== "").join("\n\n");
    }

    async function copyToClipboard() {
        try {
            const deckText = parseDecklist();
            await navigator.clipboard.writeText(deckText);
        }
        catch (err) {
            console.error("Erreur lors de la copie : ", err);
        }
    } 


    return (
        <Button startDecorator={<ContentPasteGo/>} onClick={copyToClipboard}>Copy to clipboard</Button>
    )
}