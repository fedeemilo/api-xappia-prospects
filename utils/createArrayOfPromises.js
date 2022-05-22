const { axios } = require("../services");
const {
    makeToyotaObject,
    makeVolkswagenObject
} = require("./makeProspectObject");
const forEach = require("lodash/forEach");

const asyncSendToyotaLead = async prospectObj => {
    const {
        prospect: {
            customer: { contacts }
        }
    } = prospectObj;

    const name = contacts[0].names[0].value;
    const lastname = contacts[0].names[1].value;

    try {
        const res = await axios.post(
            process.env.BASE_API_TOYOTA,
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

const asyncSendVolkswagenLead = async prospectObj => {
    console.log(process.env.BASE_API_VOLKSWAGEN);
    try {
        const res = await axios.post(
            process.env.BASE_API_VOLKSWAGEN,
            prospectObj
        );

        const { status, data } = res;

        console.log(res);
        const ok = status === 200;

        if (ok) return { data };
    } catch (error) {
        console.log(error);
    }
};

const toyotaPromises = arrOfLeads => {
    let promises = [];

    forEach(arrOfLeads, lead => {
        const { name, lastname, phones, code, comments, providerOrigin } = lead;

        const prospectObj = makeToyotaObject({
            name,
            lastname,
            phones,
            code,
            comments,
            providerOrigin
        });

        if (lastname) {
            promises.push(asyncSendToyotaLead(prospectObj));
        }
    });

    return promises;
};

const volkswagenPromises = arrOfLeads => {
    let promises = [];

    forEach(arrOfLeads, lead => {
        const {
            name,
            lastname,
            phone,
            email,
            teamId,
            product,
            origin,
            autoahorro
        } = lead;

        const prospectObj = makeVolkswagenObject({
            name,
            lastname,
            phone,
            email,
            teamId,
            product,
            origin,
            autoahorro
        });

        if (lastname) {
            promises.push(asyncSendVolkswagenLead(prospectObj));
        }
    });

    return promises;
};

module.exports = { toyotaPromises, volkswagenPromises };
