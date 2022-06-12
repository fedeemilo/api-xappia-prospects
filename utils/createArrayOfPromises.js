const { default: axios } = require("axios");
const {
    createToyotaObj,
    createVolkswagenObj
} = require("./makeProspectObject");
const forEach = require("lodash/forEach");

const sendToyotaLead = async (leadObj, dealer) => {
    const {
        prospect: {
            customer: { contacts }
        }
    } = leadObj;

    const name = contacts[0].names[0].value;
    const lastname = contacts[0].names[1].value;

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            username: process.env.XAPPIA_USERNAME,
            password: process.env.XAPPIA_PASSWORD,
            dealer
        }
    };
    try {
        const res = await axios.post(
            process.env.XAPPIA_API_TOYOTA,
            JSON.stringify(leadObj),
            config
        );
        const { status, data } = res;
        const { LeadId: leadId } = data;
        const ok = status === 200;

        if (ok) return { leadId, name, lastname };
    } catch (err) {
        if (err.response.data) {
            if (err.response.data["Auth error"])
                throw new Error(
                    "❌ El nombre de usuario o contraseña es incorrecto."
                );
        } else {
            throw new Error(
                "❌ No se pudo enviar el lead. Inténtelo de nuevo."
            );
        }
    }
};

const sendVolkswagenLead = async prospectObj => {
    try {
        const res = await axios.post(
            process.env.XAPPIA_API_VOLKSWAGEN,
            prospectObj
        );

        const { status, data } = res;
        const ok = status === 200;

        if (ok) return { data };
    } catch (error) {
        console.log(error);
    }
};

const handlePromises = (leads, createLead, sendLead, dealer) => {
    let promises = [];

    forEach(leads, lead => {
        const leadObj = createLead(lead);

        if (lead.lastname) {
            promises.push(sendLead(leadObj, dealer));
        }
    });

    return promises;
};

const toyotaPromises = (toyotaLeads, dealer) =>
    handlePromises(toyotaLeads, createToyotaObj, sendToyotaLead, dealer);

const volkswagenPromises = volkswagenLeads =>
    handlePromises(volkswagenLeads, createVolkswagenObj, sendVolkswagenLead);

module.exports = { toyotaPromises, volkswagenPromises };
