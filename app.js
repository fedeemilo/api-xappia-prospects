require("./config");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const routesLeads = require("./routes/route.leads");
const PORT = process.env.PORT;

// Swagger Docs
const swaggerDocs = require("./swagger_config");
// Swagger User Interface
const swaggerUi = require("swagger-ui-express");



/* Middlewares */
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

/* Routes */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", routesLeads);

/* Server Listening */
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

