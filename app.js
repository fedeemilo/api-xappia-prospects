require("./config");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routesLeads = require("./routes/route.leads");
const PORT = process.env.PORT;
const swaggerDocs = require("./swagger_config");
const swaggerUi = require("swagger-ui-express");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs: ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    const app = express();

    // View Engine
    app.set("view engine", "ejs");

    /* Middlewares */
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.static("public"));
    app.use(
        express.urlencoded({
            extended: false
        })
    );
    app.use(express.json());

    app.use((req, res, next) => {
        console.log("worker: ", cluster.worker.id);
        console.log("Path:", req.originalUrl);
        console.log(process.env.NODE_ENV);
        console.log(process.env.BASE_USERNAME);
        console.log(process.env.NBASE_PASSWORD);
        console.log(process.env.BASE_API_TOYOTA);
        next();
    });
    /* Routes */
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use("/", routesLeads);

    /* Server Listening */
    app.listen(PORT, () => {
        console.log(
            `🚀 Server listening on port ${PORT} (worker ${cluster.worker.id})`
        );
    });
}
