require('dotenv').config()
const fetch = require("node-fetch");
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
const makePropsectObject = require("../utils");

module.exports = {
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



    let prospect = makePropsectObject(
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
    );

    // Entorno producción
    const url = "https://api.toyota.com.ar:9201/dcx/api/leads";

    // Entorno pruebas
    // const url = "http://200.7.15.135:9201/dcx/api/leads";

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

      console.log(response);

      const resJson = await response.json();
      const { ok, status } = response;

      if (ok) {
        return res.json(resJson);
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
  }
};
