const { fullDate } = require("./dates");

const makeArrayPhones = phones =>
    phones.reduce((arr, phone) => {
        let type = phone.length <= 8 ? "phone" : "mobile";
        arr.push({ type, value: phone });
        return arr;
    }, []);

const makeToyotaObject = ({
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

const makeVolkswagenObject = ({
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

module.exports = { makeToyotaObject, makeVolkswagenObject };
