const { fullDate } = require("./dates");

const makeArrayPhones = phones =>
    phones.reduce((arr, phone) => {
        let type = phone.length <= 8 ? "phone" : "mobile";
        arr.push({ type, value: phone });
        return arr;
    }, []);

const createToyotaObj = ({
    comments = "",
    interest = "",
    mail = "",
    name = "",
    lastname = "",
    phones = "",
    city = "",
    country = "",
    vehicles,
    providerValue = "Datero",
    providerOrigin
}) => {
    const arrPhones = makeArrayPhones(phones);

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
                                value: mail
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
                        phones: arrPhones,
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
            },
            vendor: {
                vendorname: {
                    value: "Almas"
                }
            }
        }
    };

    return prospect;
};

const createVolkswagenObj = ({
    name,
    lastname,
    phone,
    email,
    teamId,
    product,
    origin,
    autoahorro
}) => {
    const prospect = {
        FirstName: name,
        LastName: lastname,
        Origin: origin,
        Phone: `${phone}`,
        Email: email,
        ConcesionarioId: teamId,
        Product: product,
        Autoahorro: autoahorro
    };

    return prospect;
};

module.exports = { createToyotaObj, createVolkswagenObj };
