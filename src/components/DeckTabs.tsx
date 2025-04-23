import { Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import React, { useState } from "react";
import { CardEntry } from "../../api/cards";


type GroupedDeck = {
    [type: string]: CardEntry[];
  };
  
  function groupDeckByType(deck: CardEntry[]): GroupedDeck {
    const groups: GroupedDeck = {
      Land: [],
      Creature: [],
      Enchantment: [],
      Planeswalker: [],
      Battle: [],
      Artifact: [],
      Instant: [],
      Sorcery: [],
    };
  
    for (const entry of deck) {
      const types = entry.card.type_line;
  
      if (types.includes("Land")) groups.Land.push(entry);
      else if (types.includes("Creature")) groups.Creature.push(entry);
      else if (types.includes("Planeswalker")) groups.Planeswalker.push(entry);
      else if (types.includes("Battle")) groups.Battle.push(entry);
      else if (types.includes("Instant")) groups.Instant.push(entry);
      else if (types.includes("Sorcery")) groups.Sorcery.push(entry);
      else if (types.includes("Artifact")) groups.Artifact.push(entry);
      else if (types.includes("Enchantment")) groups.Enchantment.push(entry);
    }
  
    return groups;
  }
  

export default function DeckTabs({ deck }: { deck: CardEntry[] }) {
    const [index, setIndex] = useState(0);
    const grouped = groupDeckByType(deck);

    const types = Object.keys(grouped).filter((type) => grouped[type].length > 0);

    return (
        <Tabs value={index} onChange={(_, newIndex) => setIndex(newIndex)}>
        <TabList
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                bgcolor: "background.surface",
            }}
        >
            {types.map((type, idx) => (
            <Tab key={type} value={idx}>
                {type}
            </Tab>
            ))}
        </TabList>

        {types.map((type, idx) => (
            <TabPanel key={type} value={idx}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {grouped[type].map(({ card, qty }) => (
                <div key={card.id}>
                    <img src={card.image_uris?.small} alt={card.name} />
                    <p>{qty}x {card.name}</p>
                </div>
                ))}
            </div>
            </TabPanel>
        ))}
        </Tabs>
    );
}
