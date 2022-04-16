require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");

const { makeProspectObject, createArrayOfPromises } = require("../utils");
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

    async convertExcelToJson(req, res) {
        const result = excelToJson({
            sourceFile: req.file.path
        });

        let filterResult = Object.values(result)[0].slice(1);

        const convertedResult = filterResult.reduce((arr, obj) => {
            let {
                A: fullName,
                B: phone,
                C: mail,
                D: code,
                E: comments,
                F: providerOrigin
            } = obj;
            let arrName = [];
            let arrPhones = [];
            14;

            if (fullName) {
                arrName = fullName.split(" ");
            }

            if (phone) {
                arrPhones = [].concat(phone.toString());
            }

            let newProspect = {
                name: arrName[0],
                lastname: arrName[arrName.length - 1],
                phones: arrPhones,
                mail,
                code,
                comments,
                providerOrigin
            };

            arr.push(newProspect);
            return arr;
        }, []);

        /* Make multiple requests based on convertedResult length */

        const promises = createArrayOfPromises(convertedResult);


        Promise.all(promises)
            .then(data => {
                if (data.length > 0) {
                    console.log(data);
                    res.json(data);
                    res.end();
                } else {
                    res.send(htmlError(result));
                }
            })
            .catch(err => {
                res.send(htmlError(err));
            });
    }
};
