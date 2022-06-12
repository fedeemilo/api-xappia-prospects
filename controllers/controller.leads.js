require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const { makeToyotaObject } = require("../utils/makeProspectObject");
const { htmlError } = require("../pages/error");
const handleErrors = require("../utils/errors");
const { default: axios } = require("axios");
const axiosInstance = require("../services/axios");
const {
    toyotaJsonToLeadsArr,
    volkswagenJsonToLeadsArr
} = require("../utils/parseJsonToLeadsArr");
const {
    toyotaPromises,
    volkswagenPromises
} = require("../utils/createArrayOfPromises");

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

        const prospect = makeToyotaObject({
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
    },

    /* Convert Toyota Excel file to json and reduce it to an array of leads to send */
    async toJsonLeadsToyota(req, res) {
        const { dealer } = req.query;
        const jsonFile = excelToJson({
            sourceFile: req.file.path
        });

        const filterJson = Object.values(jsonFile)[0].slice(1);
        const convertedResult = toyotaJsonToLeadsArr(filterJson);
        const promises = toyotaPromises(convertedResult, dealer);

        axios
            .all(promises)
            .then(
                axios.spread((...data) => {
                    res.json({
                        ok: true,
                        result: data
                    });
                })
            )
            .catch(err => {
                console.log(err.message);
                res.status(500).json({
                    ok: false,
                    error: err.message
                });
            });
    },

    /* Convert Volkswagen Excel file to json and reduce it to an array of leads to send */
    async toJsonLeadsVolkswagen(req, res) {
        if (!req.file)
            return res.json({
                ok: false,
                result: { message: "Error con el archivo cargado" }
            });

        const jsonFile = excelToJson({
            sourceFile: req.file.path
        });

        const filterJson = Object.values(jsonFile)[0].slice(1);
        const convertedResult = volkswagenJsonToLeadsArr(filterJson);
        const promises = volkswagenPromises(convertedResult);

        axios
            .all(promises)
            .then(
                axios.spread((...data) => {
                    res.json({ ok: true, result: data[0].data });
                })
            )
            .catch(err =>
                res.json({
                    ok: false,
                    result: err
                })
            );
    }
};
