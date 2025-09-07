const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require("path");


const app = express();
const port = process.env.API_PORT || 4000;


app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://dkbldr.up.railway.app",
        "https://dkbldr-api.up.railway.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const deckRoutes = require("./routes/decks");
app.use("/api/decks", deckRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const cardRoutes = require("./routes/cards");
app.use("/api/cards", cardRoutes);

const tagRoutes = require("./routes/archetypes");
app.use("/api/tags", tagRoutes);

const storageRoutes = require("./routes/storage");
app.use("/api/storage", storageRoutes);


const envRoute = require("./routes/env");
app.use("/api/env", envRoute);


app.get("/", (req, res) => {
    res.status(200).send(`<img src="https://i.pinimg.com/originals/29/3a/55/293a55a10b33f45c07ecea5420ec70a6.gif" alt="Hello"/>`)
})


app.listen(port, () => {
    console.log(`🟢 dkbldr-api listening on port ${port}`);
    console.log(`API documentation available at ${process.env.API_URL}/api-docs`);
});