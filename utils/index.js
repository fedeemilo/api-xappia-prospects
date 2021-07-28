/* ARMAR OBJETO LEAD */
const { response } = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
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

const url = "https://api.toyota.com.ar:9201/dcx/api/leads";
const date = new Date();
const [month, day, year] = [
  date.getMonth(),
  date.getDate(),
  date.getFullYear()
];
const [hour, minutes, seconds] = [
  date.getHours(),
  date.getMinutes(),
  date.getSeconds()
];

const fullDate = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

const simpleDate = `${day}-${month}-${year}`;

const fullDate2 = `${day}.${month}.${year}${hour}:${minutes}:${seconds}`;

const makeArrayPhones = phones => {
  let arrPhones = phones.reduce((arr, phone) => {
    let type = phone.length <= 8 ? "phone" : "mobile";
    arr.push({ type, value: phone });
    return arr;
  }, []);
  return arrPhones;
};

const makeProspectObject = ({
  comments = "",
  interest = "",
  email = "",
  name = "",
  lastname = "",
  phones = "",
  city = "",
  country = "",
  vehicles,
  providerValue = "Datero",
  providerOrigin
}) => {
  let phonesArr = makeArrayPhones(phones);

  let prospect = {
    prospect: {
      requestdate: fullDate,
      customer: {
        comments,
        interest: !interest ? "PLAN" : interest,
        contacts: [
          {
            emails: [
              {
                value: email
              }
            ],
            names: [
              {
                part: "first",
                value: name
              },
              {
                part: "last",
                value: lastname
              }
            ],
            phones: phonesArr,
            addresses: [
              {
                city,
                country
              }
            ]
          }
        ]
      },
      vehicles: [
        {
          make: "",
          model: "",
          code: ""
        }
      ],
      provider: {
        name: {
          value: providerValue,
          origin: providerOrigin
        }
      }
    }
  };

  return prospect;
};

/* Create promise to handle multiple POST requests of leads */

let sendNewLead = prospectObj => {
  return new Promise((resolve, reject) => {
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

    let okResponse;
    let statusResponse;

    return fetch(url, options)
      .then(response => {
        const { ok, status } = response;
        okResponse = ok;
        statusResponse = status;

        return response.json();
      })
      .then(resJson => {
        console.log(resJson);

        let { LeadId } = resJson;

        if (okResponse) {
          return resolve(LeadId);
        }

        /* Error 400 */
        if (statusResponse === 400) {
          if (resJson.Error === "Faltan campos obligatorios: [LastName]") {
            return reject({
              okResponse,
              statusResponse,
              message: noLastNameMsg
            });
          }

          if (
            resJson.Error.contains("operation performed with inactive user")
          ) {
            return reject({
              okResponse,
              statusResponse,
              message: inactiveUserMsg,
              help: inactiveUserHelp
            });
          }
        }

        /* Error 404 */
        if (statusResponse === 404) {
          // Invalid user
          if (resJson["Auth error"] === "invalid user") {
            return reject({
              okResponse,
              statusResponse,
              message: invalidUserMsg,
              help: invalidUserHelp
            });
          }

          // Invalid password
          if (resJson["Auth error"] === "invalid password") {
            return reject({
              okResponse,
              statusResponse,
              message: invalidPasswordMsg,
              help: invalidPasswordHelp
            });
          }
        }

        /* Error 412 */
        if (statusResponse === 412) {
          if (resJson.Error === "no dealer specified") {
            return reject({
              ok,
              statusResponse,
              message: noDealerMsg,
              help: noDealerHelp
            });
          }

          if (resJson.Error === "Fuente no registrada") {
            return reject({
              ok,
              statusResponse,
              message: invalidProviderMsg,
              help: invalidProviderHelp
            });
          }
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

let createArrayOfPromises = arrOfLeads => {
  let promises = [];

  for (let i = 0; i < arrOfLeads.length; i++) {
    let { name, lastname, phones, code, comments, providerOrigin } =
      arrOfLeads[i];

    let prospectObj = makeProspectObject({
      name,
      lastname,
      phones,
      code,
      comments,
      providerOrigin
    });

    console.log("*");
    console.log(JSON.stringify(prospectObj));
    console.log("*");

    if (lastname) {
      promises.push(sendNewLead(prospectObj));
    }
  }

  return promises;
};

module.exports = {
  makeProspectObject,
  simpleDate,
  fullDate2,
  createArrayOfPromises
};
