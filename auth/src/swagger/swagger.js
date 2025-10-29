const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for the e-commerce backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // apna local ya deployed URL yaha do
      },
    ],
  },
  apis: [
    "./src/routes/admin.route.js",   // ✅ correct path to your route files
    "./src/routes/auth.route.js",
    "./src/routes/seller.route.js"
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger Docs available at: http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
