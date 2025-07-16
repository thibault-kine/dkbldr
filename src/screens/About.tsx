import { Box, Link, List, ListItem, Typography } from "@mui/joy"
import "../style/About.css"

export default function About() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "90%", height: "100%", margin: "25px auto" }}>
            <section>
                <Typography className="question-header">What is Dkbldr?</Typography>
                <Box className="sep-about"></Box>
                <Typography className="question-body">
                    <b>Dkbldr is a mobile-first deckbuilding assistant.</b><br/> 
                    Its main goal is to allow users to craft <Link href="https://magic.wizards.com/en/formats/commander">EDH</Link> decks on the go.
                    Many other similar tools (such as <Link href="https://moxfield.com/">Moxfield</Link>, <Link href="https://scryfall.com/">Scryfall</Link> or <Link href="https://archidekt.com/">Archidekt</Link>) 
                    lack a good mobile user experience.<br/> 
                    This app was made with that principle in mind: to offer an accessible and easy-to-use deckbuilding tool. 
                </Typography>
            </section>

            <section>
                <Typography className="question-header">What are Dkbldr's main features?</Typography>
                <Box className="sep-about"></Box>
                <Typography>
                    Dkbldr can offer many features, such as:
                </Typography>
                <List>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🧠 Easy and fast deckbuilding, with a powerful searchbar and an import/export tool</ListItem>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🏷️ Helpful tagging system that helps users filter decks by their themes</ListItem>
                    <ListItem sx={{ color: "var(--txt-color)" }}>💭 An app-wide search engine that allows users to search decks, commanders, and other users</ListItem>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🫂 An integrated social network aspect. Users can follow eachother and promote decks</ListItem>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🔐 A secure authentication process using 2FA</ListItem>
                </List>
                <Typography>
                    And here are the upcoming main features:
                </Typography>
                <List>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🤖 An AI assistant that will be able to help you pick the best cards for your decks</ListItem>
                    <ListItem sx={{ color: "var(--txt-color)" }}>🖨️ A proxying tool that will allow you to print out the desired cards</ListItem>
                </List>
                <Typography className="question-body">
                    However, remember that this project is still a work-in-progress. Those features might not work as well as they should.
                    If you ever encounter an issue, <Link href="mailto:thibault.kine@laplateforme.io">please send me an e-mail</Link>.
                </Typography>
            </section>

            <section>
                <Typography className="question-header">What resources are used by Dkbldr?</Typography>
                <Box className="sep-about"></Box>
                <Typography className="question-body">
                    The app itself was made using <Link href="https://vite.dev/">ReactJS + Vite</Link>.
                    Dkbldr uses <Link href="https://scryfall.com/docs/api">Scryfall's api</Link> to fetch the card's informations, via
                    <Link href="https://www.npmjs.com/package/scryfall-api"><pre>scryfall-api</pre></Link>.
                    The non-API data is stored using <Link href="https://supabase.com/">Supabase</Link>.
                </Typography>
            </section>
        </Box>
    )
}