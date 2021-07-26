/* ARMAR OBJETO LEAD */

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

module.exports = { makeProspectObject, simpleDate };
