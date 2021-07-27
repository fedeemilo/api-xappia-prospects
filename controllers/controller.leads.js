require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
const axios = require("axios");
const fs = require("fs");
const {
  invalidUserMsg,
  invalidPasswordMsg,
  noDealerMsg,
  noDealerHelp,
  invalidUserHelp,
  invalidPasswordHelp,
  invalidProviderMsg,
  invalidProviderHelp,
  noLastNameMsg,
  inactiveUserMsg,
  inactiveUserHelp
} = require("../constants/messages");
const { makeProspectObject } = require("../utils");
const { htmlSuccess } = require("../pages/success");

// Entorno producción
const url = "https://api.toyota.com.ar:9201/dcx/api/leads";

// Entorno pruebas
// const url = "http://200.7.15.135:9201/dcx/api/leads";

module.exports = {
  /* Send single Lead to salesforce threw Swagger api-docs */
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

    console.log(req.body);

    let prospect = makeProspectObject({
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

    console.log(JSON.stringify(prospect));

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

      /* Error 400 */
      if (status === 400) {
        if (resJson.Error === "Faltan campos obligatorios: [LastName]") {
          res.json({
            ok,
            status,
            message: noLastNameMsg
          });
        }

        if (resJson.Error.contains("operation performed with inactive user")) {
          res.json({
            ok,
            status,
            message: inactiveUserMsg,
            help: inactiveUserHelp
          });
        }
      }

      /* Error 404 */
      if (status === 404) {
        // Invalid user
        if (resJson["Auth error"] === "invalid user") {
          return res.json({
            ok,
            status,
            message: invalidUserMsg,
            help: invalidUserHelp
          });
        }

        // Invalid password
        if (resJson["Auth error"] === "invalid password") {
          return res.json({
            ok,
            status,
            message: invalidPasswordMsg,
            help: invalidPasswordHelp
          });
        }
      }

      /* Error 412 */
      if (status === 412) {
        if (resJson.Error === "no dealer specified") {
          return res.json({
            ok,
            status,
            message: noDealerMsg,
            help: noDealerHelp
          });
        }

        if (resJson.Error === "Fuente no registrada") {
          return res.json({
            ok,
            status,
            message: invalidProviderMsg,
            help: invalidProviderHelp
          });
        }
      }
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
      let { A: fullName, B: phone, C: mail, D: code, E: comments } = obj;
      let arrName = [];
      let arrPhones = [];

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
        comments
      };

      arr.push(newProspect);
      return arr;
    }, []);

    let responsePostMultiple = await axios.post(
      `${process.env.BASE_URL}/leads-multiple`,
      convertedResult
    );

    // * PUNTO DE RETORNO (desde sendMultipleLeads)

    if (responsePostMultiple.status === 200) {
      console.log(responsePostMultiple.data);
      res.send(htmlSuccess(JSON.stringify(responsePostMultiple.data)));
      res.end();
    }
  },

  async sendMultipleLeads(req, res) {
    let arrOfLeads = req.body;
    let arrLeadIDs = [];

    for (let lead in arrOfLeads) {
      let { name, lastname, phones, code, comments } = arrOfLeads[lead];

      let prospectObj = makeProspectObject({
        name,
        lastname,
        phones,
        code,
        comments
      });

      // Log of Prospect object
      console.log("*");
      console.log(JSON.stringify(prospectObj));
      console.log("*");

      const options = {
        method: "post",
        body: JSON.stringify(prospectObj),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          username: process.env.HEADER_USERNAME,
          password: process.env.HEADER_PASSWORD,
          dealer: process.env.HEADER_DEALER
        }
      };

      if (lastname) {
        try {
          let response = await fetch(url, options);
          let resJson = await response.json();
          const { ok, status } = response;

          if (ok) {
            console.log(resJson);
            arrLeadIDs.push(resJson.LeadId);
            let lastItem = arrOfLeads.length - 1;

            if (lead == lastItem) {
              res.send(arrLeadIDs);
              break;
            }
          }

          /* Error 400 */
          if (status === 400) {
            if (resJson.Error === "Faltan campos obligatorios: [LastName]") {
              res.json({
                ok,
                status,
                message: noLastNameMsg
              });
            }

            if (
              resJson.Error.contains("operation performed with inactive user")
            ) {
              res.json({
                ok,
                status,
                message: inactiveUserMsg,
                help: inactiveUserHelp
              });
            }
          }

          /* Error 404 */
          if (status === 404) {
            // Invalid user
            if (resJson["Auth error"] === "invalid user") {
              return res.json({
                ok,
                status,
                message: invalidUserMsg,
                help: invalidUserHelp
              });
            }

            // Invalid password
            if (resJson["Auth error"] === "invalid password") {
              return res.json({
                ok,
                status,
                message: invalidPasswordMsg,
                help: invalidPasswordHelp
              });
            }
          }

          /* Error 412 */
          if (status === 412) {
            if (resJson.Error === "no dealer specified") {
              return res.json({
                ok,
                status,
                message: noDealerMsg,
                help: noDealerHelp
              });
            }

            if (resJson.Error === "Fuente no registrada") {
              return res.json({
                ok,
                status,
                message: invalidProviderMsg,
                help: invalidProviderHelp
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    res.end();
  }
};
