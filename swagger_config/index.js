// Swagger
const swaggerJsDoc = require("swagger-jsdoc");

// Options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "API Xappia Prospectos",
      description:
        "Servicio para el envío de leads a Salesforce",
      contact: {
        name: "Federico Milone",
        email: "fedeemilo91@gmail.com"
      },
      servers: ["http://localhost:5005"]
    }
  },
  apis: ["./routes/route.*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
