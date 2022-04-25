const { axios } = require("../services");
const makeProspectObject = require("./makeProspectObject");

const asyncSendLead = async prospectObj => {
    const {
        prospect: {
            customer: { contacts }
        }
    } = prospectObj;

    const name = contacts[0].names[0].value;
    const lastname = contacts[0].names[1].value;

    try {
        const res = await axios.post(
            "https://api.toyota.com.ar:9201/dcx/api/leads",
            JSON.stringify(prospectObj)
        );
        const { status, data } = res;
        const { LeadId: leadId } = data;
        const ok = status === 200;

        if (ok) return { leadId, name, lastname };
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
