require("../config");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const excelToJson = require("convert-excel-to-json");
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
const { makeProspectObject, createArrayOfPromises } = require("../utils");
const { htmlSuccess } = require("../pages/success");
const { htmlError } = require("../pages/error");
const writeTxtFile = require("../utils/write-txt");
const { fstat } = require("fs");
const { default: axios } = require("axios");

// Entorno producción
const url = "https://api.toyota.com.ar:9201/dcx/api/leads";

// Entorno pruebas
// const url = "http://200.7.15.135:9201/dcx/api/leads";

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

    let arrOfLeads = convertedResult;
    let promises = createArrayOfPromises(arrOfLeads);

    axios
      .all(promises)
      .then(
        axios.spread((...responses) => {
          if (responses.length > 0) {
            res.json(prospects);
            res.end();
          } else {
            res.send(htmlError(result));
          }
        })
      )
      .catch(err => {
        res.send(htmlError(err));
      });

    // Promise.all(promises)
    //   .then(result => {
    //     console.log(result)
    //     for (let i = 0; i < promises.length; i++) {
    //       arrLeadIDs.push({
    //         name: convertedResult[i].name,
    //         lastname: convertedResult[i].lastname,
    //         leadId: result[i]
    //       });
    //     }

    //     if (arrLeadIDs.length > 0) {
    //       res.json(arrLeadIDs)
    //       res.end();
    //     } else {
    //       res.send(htmlError(result));
    //     }
    //   })
    //   .catch(err => {
    //     res.send(htmlError(err));
    //   });
  },

  /* Download lead ID's in a txt file */
  downloadLeads(req, res) {
    let content = req.cookies.arrLeadIDs;
    let ID = JSON.parse(content).length;
    let leadsFileName = `leads-${ID}.txt`;

    writeTxtFile(content, leadsFileName);

    let filePath = path.join(__dirname, "..", "utils/lead_ids/", leadsFileName);
    res.setHeader("content-type", "application/text");
    res.header("Content-Disposition", `attachment; filename=${leadsFileName}`);
    fs.createReadStream(filePath).pipe(res);
  }
};
