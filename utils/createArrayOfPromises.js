const { axios } = require("../services");
const makeProspectObject = require("./makeProspectObject");

const asyncSendLead = async prospectObj => {
    try {
        const res = await axios.post(
            "http://ec2-13-58-180-105.us-east-2.compute.amazonaws.com:8000",
            JSON.stringify(prospectObj)
        );
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

        if (lastname) {
            promises.push(asyncSendLead(prospectObj));
        }
    }

    return promises;
};

module.exports = createArrayOfPromises;
