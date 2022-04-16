/* ARMAR OBJETO LEAD */
const { axios } = require("../services");
const handleErrors = require("./errors");
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

const isLocalhost = process.env.NODE_ENV === "dev";
const fullDate = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
const simpleDate = `${day}-${month}-${year}`;
const url = isLocalhost
    ? "https://200.7.15.135:9201/dcx/api/leads"
    : "https://api.toyota.com.ar:9201/dcx/api/leads";

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
    const phonesArr = makeArrayPhones(phones);

    const prospect = {
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

const asyncSendLead = async prospectObj => {
    try {
        const res = await axios.post(url, JSON.stringify(prospectObj));
        const { status, data } = res;
        const { LeadId } = data;
        const ok = status === 200;

        if (ok) {
            return LeadId;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};

const createArrayOfPromises = arrOfLeads => {
    let promises = [];

    for (let i = 0; i < arrOfLeads.length; i++) {
        const { name, lastname, phones, code, comments, providerOrigin } =
            arrOfLeads[i];

        const prospectObj = makeProspectObject({
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
            promises.push(asyncSendLead(prospectObj));
        }
    }

    return promises;
};

module.exports = {
    makeProspectObject,
    createArrayOfPromises,
    simpleDate
};
