const { fullDate } = require("./dates");

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

module.exports = makeProspectObject;
