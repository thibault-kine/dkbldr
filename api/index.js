const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require("path");


const app = express();
const port = process.env.API_PORT || 4000;


app.use(cors());
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


app.listen(port, () => {
    console.log(`🟢 dkbldr-api listening on port ${port}`);
    console.log(`API documentation available at http://${process.env.API_URL}/api-docs`);
});