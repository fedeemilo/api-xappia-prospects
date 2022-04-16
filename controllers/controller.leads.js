require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");

const {
    makeProspectObject,
    createArrayOfPromises,
    parseJsonToLeadsArr
} = require("../utils");
const { htmlError } = require("../pages/error");
const axios = require("axios");
const handleErrors = require("../utils/errors");

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
        res.sendFile(path.join(__dirname, "..", "pages", "/excel.html"));
    },

    /* Convert Excel file to json and reduce it to an array of leads to send */
    async convertExcelToJson(req, res) {
        const jsonFile = excelToJson({
            sourceFile: req.file.path
        });

        const filterJson = Object.values(jsonFile)[0].slice(1);
        const convertedResult = parseJsonToLeadsArr(filterJson);
        const promises = createArrayOfPromises(convertedResult);

        try {
            const allLeads = await Promise.all(promises);

            if (allLeads.length > 0) {
                res.json(allLeads);
                res.end();
            } else {
                res.send(htmlError(result));
            }
        } catch (error) {
            res.send(htmlError(error));
        }
    }
};
