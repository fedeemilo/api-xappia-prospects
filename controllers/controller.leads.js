require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const {
    createArrayOfPromises,
    parseJsonToLeadsArr,
    makeProspectObject
} = require("../utils");
const { htmlError } = require("../pages/error");
const handleErrors = require("../utils/errors");
const { default: axios } = require("axios");
const { htmlSuccess } = require("../pages/success");
const cluster = require("cluster");

// Entorno producción
// const url = "https://api.toyota.com.ar:9201/dcx/api/leads";

// Entorno pruebas
const url = "http://200.7.15.135:9201/dcx/api/leads";

module.exports = {
    /* Send single Lead to salesforce through Swagger api-docs */
    async sendLead(req, res) {
        const {
            comments,
            interest,
            email,
            name,
            lastname,
            phones,
            city,
            country,
            vehicles,
            providerValue,
            providerOrigin
        } = req.body;

        const prospect = makeProspectObject({
            comments,
            interest,
            email,
            name,
            lastname,
            phones,
            city,
            country,
            vehicles,
            providerValue,
            providerOrigin
        });

        const options = {
            method: "post",
            body: JSON.stringify(prospect),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                username: process.env.HEADER_USERNAME,
                password: process.env.HEADER_PASSWORD,
                dealer: process.env.HEADER_DEALER
            }
        };

        try {
            const response = await fetch(url, options);
            const resJson = await response.json();
            const { ok, status } = response;

            if (ok) {
                return res.json(resJson);
            }

            handleErrors(status, resLead, res, ok);
        } catch (err) {
            console.log(err);
            res.json({
                ok: false,
                err
            });
        }
    },

    /* Render page for uploading Excel file */
    uploadLead(req, res) {
        res.render(path.join(__dirname, "..", "views/pages", "/excel.ejs"));
        cluster.worker.kill();
    },

    /* Convert Excel file to json and reduce it to an array of leads to send */
    async convertExcelToJson(req, res) {
        const jsonFile = excelToJson({
            sourceFile: req.file.path
        });

        const filterJson = Object.values(jsonFile)[0].slice(1);
        const convertedResult = parseJsonToLeadsArr(filterJson);
        const promises = createArrayOfPromises(convertedResult);

        axios
            .all(promises)
            .then(
                axios.spread((...data) => {
                    console.log(data);
                    res.json({
                        ok: true,
                        result: data
                    });
                })
            )
            .catch(err => res.send(htmlError(err)));
    }
};
