/* ARMAR OBJETO LEAD */
const { response } = require("express");
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

const url =  "https://api.toyota.com.ar:9201/dcx/api/leads";
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
  providerOrigin = "Leads TPA"
}) => {
  let phonesArr = makeArrayPhones(phones);

  let prospect = {
    prospect: {
      requestdate: fullDate,
      customer: {
        comments,
        interest: !interest ? "CONVENCIONAL" : interest,
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

    return fetch(url, options)
      .then(response => {
        return response.json();
      })
      .then(resJson => {
        console.log(resJson)
        return resolve(resJson);
      })
      .catch(err => {
        reject(err);
      });
  });
};

let createArrayOfPromises = arrOfLeads => {
  let promises = [];

  for (let i = 0; i < arrOfLeads.length; i++) {
    let { name, lastname, phones, code, comments } = arrOfLeads[i];

    let prospectObj = makeProspectObject({
      name,
      lastname,
      phones,
      code,
      comments
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

module.exports = { makeProspectObject, simpleDate, createArrayOfPromises };
