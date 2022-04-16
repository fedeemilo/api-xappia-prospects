require("./config");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const routesLeads = require("./routes/route.leads");
const PORT = process.env.PORT;

// Swagger Docs
const swaggerDocs = require("./swagger_config");
// Swagger User Interface
const swaggerUi = require("swagger-ui-express");

/* Middlewares */
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

app.use((req, res, next) => {
    console.log("Path:", req.originalUrl);
    next();
});
/* Routes */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", routesLeads);

/* Server Listening */
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
