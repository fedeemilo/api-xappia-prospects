require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const { createToyotaObj } = require("../utils/createLeadObject");
const handleErrors = require("../utils/errors");
const { default: axios } = require("axios");
const {
    toyotaJsonToLeadsArr,
    volkswagenJsonToLeadsArr
} = require("../utils/parseJsonToLeadsArr");
const {
    toyotaPromises,
    volkswagenPromises
} = require("../utils/createLeadPromises");
const { ENV, API_OPTIONS } = require("../utils/constants");

module.exports = {
    /* Send single Lead to salesforce through Swagger api-docs */
    async sendLead(req, res) {
        const prospect = createToyotaObj(req.body);
        const options = API_OPTIONS(prospect);

        try {
            const response = await fetch(
                process.env.XAPPIA_API_TOYOTA,
                options
            );
            const resJson = await response.json();
            const { ok, status } = response;

            if (ok) {
                return res.json(resJson);
            }

            handleErrors(status, resLead, res, ok);
        } catch (err) {
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
        if (!req.file)
            return res.json({
                ok: false,
                result: { message: "Error con el archivo cargado" }
            });

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
            .catch(err => {
                res.status(500).json({
                    ok: false,
                    error: err.message || "Error en el servidor"
                });
            });
    }
};
