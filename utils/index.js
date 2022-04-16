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

const isLocalhost = process.env.NODE_ENV !== "dev";
const fullDate = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
const simpleDate = `${day}-${month}-${year}`;
const url = isLocalhost
    ? "https://200.7.15.135:9201/dcx/api/leads"
    : "https://api.toyota.com.ar:9201/dcx/api/leads";

const makeArrayPhones = phones =>
    phones.reduce((arr, phone) => {
        let type = phone.length <= 8 ? "phone" : "mobile";
        arr.push({ type, value: phone });
        return arr;
    }, []);

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

const parseJsonToLeadsArr = excel =>
    excel.reduce((arr, obj) => {
        const {
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

        const newProspect = {
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

const asyncSendLead = async prospectObj => {
    try {
        const res = await axios.post(url, JSON.stringify(prospectObj));
        const { status, data } = res;
        const { LeadId } = data;
        const ok = status === 200;

        if (ok) return LeadId;
    } catch (err) {
        if (err.response.data) {
            if (err.response.data["Auth error"])
                throw new Error(
                    "❌ El nombre de usuario proporcionado no es válido."
                );
        } else {
            throw new Error(
                "❌ No se pudo enviar el lead. Inténtelo de nuevo."
            );
        }
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
    simpleDate,
    parseJsonToLeadsArr
};
