const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuration Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dkbldg API",
      version: "1.0.0",
      description: "API documentation for the Dkbldg deck-building app",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // chemin vers les fichiers avec les commentaires JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
