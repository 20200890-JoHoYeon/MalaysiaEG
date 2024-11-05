const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Express application",
    },
  },
  apis: ["./src/controller/**/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
